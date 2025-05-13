#!/usr/bin/env python3
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import requests
import datetime
import random
import os
import webbrowser
import subprocess
import platform
import speech_recognition as sr
import pyttsx3
import threading
import openai
from werkzeug.utils import secure_filename
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI
openai.api_key = os.environ.get("OPENAI_API_KEY", "your_openai_api_key_here")

# Initialize text-to-speech engine
engine = pyttsx3.init()

# Weather API configuration (you would need to sign up for an API key)
WEATHER_API_KEY = os.environ.get("WEATHER_API_KEY", "your_weather_api_key_here")
WEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

# Configure upload folder for images
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/process_command', methods=['POST'])
def process_command():
    data = request.json
    command = data.get('command', '').lower()
    
    logger.info(f"Processing command: {command}")
    
    response = {
        'text': '',
        'action': None,
        'data': {}
    }
    
    try:
        # Process with OpenAI
        ai_response = get_openai_response(command)
        response['text'] = ai_response
        
        # Extract potential actions from the command
        if 'weather' in command:
            weather_data = get_weather('New York')  # Default city, could be extracted from command
            response['action'] = 'update_weather'
            response['data'] = weather_data
        
        elif 'time' in command:
            current_time = datetime.datetime.now().strftime("%I:%M %p")
            response['action'] = 'update_time'
            response['data'] = {'time': current_time}
        
        elif 'open' in command and ('website' in command or 'url' in command or '.com' in command):
            url = extract_url(command)
            if url:
                response['action'] = 'open_url'
                response['data'] = {'url': url}
        
        # Add more action extractors as needed
        
    except Exception as e:
        logger.error(f"Error processing command: {e}")
        response['text'] = "I'm sorry, I encountered an error while processing your request."
    
    # Speak the response in a separate thread to avoid blocking
    threading.Thread(target=speak_text, args=(response['text'],)).start()
    
    return jsonify(response)

def get_openai_response(command):
    """Get a response from OpenAI based on the command"""
    try:
        # Create a system message to define JARVIS's personality
        system_message = """
        You are JARVIS (Just A Rather Very Intelligent System), an advanced AI assistant inspired by the AI from Iron Man.
        You are helpful, intelligent, and slightly formal in your responses.
        Keep responses concise but informative.
        If asked about your capabilities, mention that you can:
        - Answer questions and provide information
        - Help with basic tasks
        - Analyze images (when provided)
        - Get weather information
        - Tell time and date
        - Open websites
        """
        
        # Call the OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",  # or another appropriate model
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": command}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        # Extract and return the response text
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        logger.error(f"Error with OpenAI API: {e}")
        return "I'm having trouble connecting to my knowledge base. Let me provide a basic response instead."

def extract_url(command):
    """Extract URL from command"""
    # This is a simple implementation - could be improved with NLP
    words = command.split()
    for word in words:
        if '.' in word and ('com' in word or 'org' in word or 'net' in word):
            # Ensure it has http/https prefix
            if not word.startswith('http'):
                word = 'https://' + word
            return word
    
    # Check for common websites
    common_sites = {
        'google': 'https://www.google.com',
        'youtube': 'https://www.youtube.com',
        'facebook': 'https://www.facebook.com',
        'twitter': 'https://www.twitter.com',
        'amazon': 'https://www.amazon.com',
        'wikipedia': 'https://www.wikipedia.org'
    }
    
    for site, url in common_sites.items():
        if site in command:
            return url
    
    return None

def get_weather(city):
    """Get weather data for a city"""
    try:
        params = {
            'q': city,
            'appid': WEATHER_API_KEY,
            'units': 'imperial'  # For Fahrenheit
        }
        response = requests.get(WEATHER_BASE_URL, params=params)
        data = response.json()
        
        return {
            'city': city,
            'temperature': round(data['main']['temp']),
            'condition': data['weather'][0]['main'],
            'humidity': data['main']['humidity'],
            'wind_speed': data['wind']['speed']
        }
    except Exception as e:
        logger.error(f"Error fetching weather: {e}")
        # Return mock data if API fails
        return {
            'city': city,
            'temperature': random.randint(65, 85),
            'condition': random.choice(['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy']),
            'humidity': random.randint(30, 70),
            'wind_speed': random.randint(0, 15)
        }

def get_news():
    """Get top news headlines"""
    try:
        params = {
            'country': 'us',
            'apiKey': NEWS_API_KEY
        }
        response = requests.get(NEWS_BASE_URL, params=params)
        data = response.json()
        
        headlines = [article['title'] for article in data['articles'][:5]]
        return {
            'headlines': headlines,
            'sources': [article['source']['name'] for article in data['articles'][:5]]
        }
    except Exception as e:
        print(f"Error fetching news: {e}")
        # Return mock data if API fails
        return {
            'headlines': [
                "Scientists make breakthrough in renewable energy",
                "New AI model surpasses human performance in problem-solving",
                "Global leaders meet to discuss climate change initiatives",
                "Tech company announces revolutionary new product",
                "Sports team wins championship after dramatic comeback"
            ],
            'sources': ['Tech News', 'Science Daily', 'World Report', 'Business Insider', 'Sports Network']
        }

def extract_app_name(command):
    """Extract application name from command"""
    # This is a simple implementation - could be improved with NLP
    command = command.replace('open', '').strip()
    common_apps = {
        'browser': 'web browser',
        'chrome': 'Google Chrome',
        'firefox': 'Firefox',
        'safari': 'Safari',
        'calculator': 'Calculator',
        'notepad': 'Notepad',
        'notes': 'Notes',
        'music': 'Music Player',
        'spotify': 'Spotify',
        'mail': 'Mail',
        'email': 'Email'
    }
    
    for app in common_apps:
        if app in command:
            return common_apps[app]
    
    return command if command else None

def extract_search_term(command):
    """Extract search term from command"""
    command = command.lower()
    if 'search for' in command:
        return command.replace('search for', '').strip()
    elif 'search' in command:
        return command.replace('search', '').strip()
    elif 'google' in command:
        return command.replace('google', '').strip()
    return None

def open_application(app_name):
    """Open an application based on the operating system"""
    system = platform.system()
    
    try:
        if system == 'Windows':
            os.startfile(app_name)
        elif system == 'Darwin':  # macOS
            subprocess.call(['open', '-a', app_name])
        elif system == 'Linux':
            subprocess.call([app_name])
        return True
    except Exception as e:
        print(f"Error opening application: {e}")
        return False

def get_joke():
    """Return a random joke"""
    jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "What do you call a fake noodle? An impasta!",
        "Why don't eggs tell jokes? They'd crack each other up!",
        "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
        "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
        "Why was the math book sad? Because it had too many problems.",
        "What do you call a parade of rabbits hopping backwards? A receding hare-line.",
        "Why don't skeletons fight each other? They don't have the guts."
    ]
    return random.choice(jokes)

def speak_text(text):
    """Convert text to speech"""
    engine.say(text)
    engine.runAndWait()

@app.route('/api/analyze_image', methods=['POST'])
def analyze_image():
    """Analyze an uploaded image"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the image
        try:
            analysis_result = analyze_image_with_openai(filepath)
            return jsonify(analysis_result)
        except Exception as e:
            logger.error(f"Error analyzing image: {e}")
            return jsonify({'error': 'Failed to analyze image'}), 500
        finally:
            # Clean up the uploaded file
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'Invalid file type'}), 400

def analyze_image_with_openai(image_path):
    """Analyze image using OpenAI's vision capabilities"""
    try:
        # For this demo, we'll simulate the response
        # In a real implementation, you would use OpenAI's vision API or another image analysis service
        
        # Simulated objects detected
        objects = [
            {"name": "Person", "confidence": random.uniform(0.85, 0.99)},
            {"name": "Building", "confidence": random.uniform(0.70, 0.95)},
            {"name": "Car", "confidence": random.uniform(0.75, 0.90)},
            {"name": "Tree", "confidence": random.uniform(0.80, 0.95)}
        ]
        
        # Randomly select some objects to include
        selected_objects = random.sample(objects, k=random.randint(1, len(objects)))
        
        # Simulated descriptions
        descriptions = [
            "A person standing in front of a modern building.",
            "A scenic landscape with mountains in the background.",
            "A busy street scene with people and vehicles.",
            "An indoor setting with furniture and decorations."
        ]
        
        # Simulated tags
        all_tags = ["outdoor", "indoor", "person", "nature", "urban", "technology", 
                   "vehicle", "building", "daytime", "nighttime", "colorful", "modern"]
        
        selected_tags = random.sample(all_tags, k=random.randint(3, 7))
        
        return {
            "objects": selected_objects,
            "description": random.choice(descriptions),
            "tags": selected_tags
        }
        
    except Exception as e:
        logger.error(f"Error in image analysis: {e}")
        raise

if __name__ == '__main__':
    app.run(debug=True, port=5000)
