#!/usr/bin/env python3
import os
import cv2
import numpy as np
from PIL import Image
import io
import base64
import logging
import requests
from typing import Dict, List, Any, Tuple, Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ImageProcessor:
    """Class to handle image processing and analysis tasks"""
    
    def __init__(self):
        # Load pre-trained models for object detection
        self.initialize_models()
    
    def initialize_models(self):
        """Initialize computer vision models"""
        try:
            # Path to YOLO weights, config, and classes
            # In a real implementation, you would download these files
            # For this demo, we'll just simulate the model
            
            self.labels = ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", 
                          "truck", "boat", "traffic light", "fire hydrant", "stop sign", 
                          "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", 
                          "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", 
                          "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", 
                          "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", 
                          "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon", 
                          "bowl", "banana", "apple", "sandwich", "orange", "broccoli", "carrot", 
                          "hot dog", "pizza", "donut", "cake", "chair", "couch", "potted plant", 
                          "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", 
                          "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", 
                          "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", 
                          "hair drier", "toothbrush"]
            
            logger.info("Models initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing models: {e}")
            raise
    
    def detect_objects(self, image_path: str) -> List[Dict[str, Any]]:
        """Detect objects in an image"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not read image at {image_path}")
            
            # In a real implementation, you would run the image through your model
            # For this demo, we'll simulate object detection results
            
            # Simulated detections
            detections = []
            num_objects = np.random.randint(1, 6)  # Detect 1-5 objects
            
            for _ in range(num_objects):
                # Randomly select a class
                class_id = np.random.randint(0, len(self.labels))
                label = self.labels[class_id]
                
                # Random confidence score between 0.6 and 0.99
                confidence = np.random.uniform(0.6, 0.99)
                
                # Random bounding box
                height, width = image.shape[:2]
                x = np.random.randint(0, width - 100)
                y = np.random.randint(0, height - 100)
                w = np.random.randint(50, min(width - x, 200))
                h = np.random.randint(50, min(height - y, 200))
                
                detections.append({
                    "name": label,
                    "confidence": float(confidence),
                    "box": [x, y, w, h]
                })
            
            return detections
            
        except Exception as e:
            logger.error(f"Error in object detection: {e}")
            return []
    
    def analyze_image(self, image_path: str) -> Dict[str, Any]:
        """Perform comprehensive image analysis"""
        try:
            # Detect objects
            objects = self.detect_objects(image_path)
            
            # Generate image description (simulated)
            description = self.generate_description(objects)
            
            # Extract image tags (simulated)
            tags = self.extract_tags(objects, image_path)
            
            # Analyze colors (simulated)
            colors = self.analyze_colors(image_path)
            
            return {
                "objects": objects,
                "description": description,
                "tags": tags,
                "colors": colors
            }
            
        except Exception as e:
            logger.error(f"Error in image analysis: {e}")
            return {
                "objects": [],
                "description": "Could not analyze image",
                "tags": [],
                "colors": []
            }
    
    def generate_description(self, objects: List[Dict[str, Any]]) -> str:
        """Generate a description based on detected objects"""
        if not objects:
            return "No objects detected in this image."
        
        # Count objects by type
        object_counts = {}
        for obj in objects:
            name = obj["name"]
            if name in object_counts:
                object_counts[name] += 1
            else:
                object_counts[name] = 1
        
        # Generate description
        description_parts = []
        for name, count in object_counts.items():
            if count == 1:
                description_parts.append(f"a {name}")
            else:
                description_parts.append(f"{count} {name}s")
        
        if len(description_parts) == 1:
            description = f"This image contains {description_parts[0]}."
        elif len(description_parts) == 2:
            description = f"This image contains {description_parts[0]} and {description_parts[1]}."
        else:
            description = "This image contains " + ", ".join(description_parts[:-1]) + f", and {description_parts[-1]}."
        
        # Add a random context
        contexts = [
            "It appears to be taken outdoors.",
            "It seems to be an indoor setting.",
            "The scene looks like it's during daytime.",
            "The scene appears to be at night.",
            "It looks like a urban environment.",
            "It appears to be in a natural setting."
        ]
        
        description += " " + np.random.choice(contexts)
        
        return description
    
    def extract_tags(self, objects: List[Dict[str, Any]], image_path: str) -> List[str]:
        """Extract tags from the image"""
        # Start with tags from detected objects
        tags = [obj["name"] for obj in objects]
        
        # Add some general tags (simulated)
        general_tags = ["indoor", "outdoor", "bright", "dark", "colorful", "monochrome", 
                        "natural", "urban", "portrait", "landscape", "closeup", "wide angle"]
        
        # Randomly select 2-4 general tags
        selected_tags = list(np.random.choice(general_tags, size=np.random.randint(2, 5), replace=False))
        
        # Combine and remove duplicates
        all_tags = list(set(tags + selected_tags))
        
        return all_tags
    
    def analyze_colors(self, image_path: str) -> List[Dict[str, Any]]:
        """Analyze the dominant colors in the image"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not read image at {image_path}")
            
            # Convert to RGB (OpenCV uses BGR)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Reshape the image to be a list of pixels
            pixels = image_rgb.reshape((-1, 3))
            
            # Convert to float
            pixels = np.float32(pixels)
            
            # Define criteria
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
            
            # Number of colors (k)
            k = 5
            
            # Apply k-means clustering
            _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            # Convert back to uint8
            centers = np.uint8(centers)
            
            # Count occurrences of each label
            unique_labels, counts = np.unique(labels, return_counts=True)
            
            # Calculate percentages
            percentages = counts / counts.sum()
            
            # Sort by percentage (descending)
            sorted_indices = np.argsort(percentages)[::-1]
            
            # Prepare result
            colors = []
            for i in sorted_indices:
                center = centers[i]
                hex_color = '#{:02x}{:02x}{:02x}'.format(center[0], center[1], center[2])
                colors.append({
                    "hex": hex_color,
                    "rgb": center.tolist(),
                    "percentage": float(percentages[i])
                })
            
            return colors
            
        except Exception as e:
            logger.error(f"Error in color analysis: {e}")
            return []
    
    def draw_detection_boxes(self, image_path: str, detections: List[Dict[str, Any]]) -> str:
        """Draw bounding boxes around detected objects and return base64 encoded image"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not read image at {image_path}")
            
            # Draw boxes
            for detection in detections:
                x, y, w, h = detection["box"]
                label = detection["name"]
                confidence = detection["confidence"]
                
                # Draw rectangle
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
                
                # Prepare label text
                text = f"{label}: {confidence:.2f}"
                
                # Get text size
                text_size = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
                
                # Draw background rectangle for text
                cv2.rectangle(image, (x, y - text_size[1] - 10), (x + text_size[0], y), (0, 255, 0), -1)
                
                # Draw text
                cv2.putText(image, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
            
            # Convert to base64
            _, buffer = cv2.imencode('.jpg', image)
            jpg_as_text = base64.b64encode(buffer).decode('utf-8')
            
            return f"data:image/jpeg;base64,{jpg_as_text}"
            
        except Exception as e:
            logger.error(f"Error drawing detection boxes: {e}")
            return ""

# Example usage
if __name__ == "__main__":
    processor = ImageProcessor()
    
    # Test with a sample image
    sample_image = "sample.jpg"
    
    if os.path.exists(sample_image):
        analysis = processor.analyze_image(sample_image)
        print(f"Analysis results: {analysis}")
        
        # Draw detection boxes
        if analysis["objects"]:
            image_with_boxes = processor.draw_detection_boxes(sample_image, analysis["objects"])
            print(f"Image with detection boxes: {image_with_boxes[:100]}...")  # Print first 100 chars
    else:
        print(f"Sample image {sample_image} not found")
