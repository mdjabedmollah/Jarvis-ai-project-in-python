// Slideshow variables
let slideIndex = 1
let slideInterval
let slideSpeed = 3000 // Default speed (3 seconds)
let isPlaying = false
let currentTransition = "fade"
let progressInterval
let timerCount = slideSpeed / 1000

// DOM elements
const slides = document.querySelectorAll(".slide")
const dots = document.querySelectorAll(".dot")
const thumbnails = document.querySelectorAll(".thumbnail")
const playPauseBtn = document.getElementById("play-pause")
const playIcon = document.getElementById("play-icon")
const pauseIcon = document.getElementById("pause-icon")
const speedBtns = document.querySelectorAll(".speed-btn")
const progressBar = document.querySelector(".progress-bar")
const timerDisplay = document.getElementById("timer-count")
const fullscreenBtn = document.getElementById("fullscreen-btn")
const transitionSelect = document.getElementById("transition-select")
const shareBtns = document.querySelectorAll(".share-btn")
const slideshowContainer = document.querySelector(".slideshow-container")
const zoomableImages = document.querySelectorAll(".zoomable")

// Initialize the slideshow
document.addEventListener("DOMContentLoaded", () => {
  showSlide(slideIndex)
  setupEventListeners()
})

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Main Interface
  const activateButton = document.getElementById("activateButton")
  const commandInput = document.getElementById("commandInput")
  const sendButton = document.getElementById("sendButton")
  const responseArea = document.getElementById("responseArea")
  const weatherInfo = document.getElementById("weatherInfo")
  const timeInfo = document.getElementById("timeInfo")
  const sentimentInfo = document.getElementById("sentimentInfo")
  const jarvisInterface = document.querySelector(".jarvis-interface")
  const statusText = document.querySelector(".status-text")
  const languageSelect = document.getElementById("languageSelect")
  const userAvatar = document.getElementById("userAvatar")
  const userName = document.getElementById("userName")

  // DOM Elements - Tabs
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  // DOM Elements - Image Analysis
  const imageUpload = document.getElementById("imageUpload")
  const imageAnalysisPanel = document.getElementById("imageAnalysisPanel")
  const analyzedImage = document.getElementById("analyzedImage")
  const analysisResults = document.getElementById("analysisResults")
  const closeAnalysisBtn = document.getElementById("closeAnalysisBtn")

  // DOM Elements - Face Recognition
  const faceRecognitionBtn = document.getElementById("faceRecognitionBtn")
  const faceRecognitionPanel = document.getElementById("faceRecognitionPanel")
  const webcamVideo = document.getElementById("webcamVideo")
  const faceCanvas = document.getElementById("faceCanvas")
  const recognitionResults = document.getElementById("recognitionResults")
  const captureBtn = document.getElementById("captureBtn")
  const registerBtn = document.getElementById("registerBtn")
  const closeFaceBtn = document.getElementById("closeFaceBtn")

  // DOM Elements - Gesture Control
  const gestureControlBtn = document.getElementById("gestureControlBtn")
  const gestureControlPanel = document.getElementById("gestureControlPanel")
  const gestureVideo = document.getElementById("gestureVideo")
  const gestureCanvas = document.getElementById("gestureCanvas")
  const gestureStatus = document.getElementById("gestureStatus")
  const closeGestureBtn = document.getElementById("closeGestureBtn")

  // DOM Elements - Smart Home
  const deviceToggles = document.querySelectorAll(".device-toggle")
  const brightnessSliders = document.querySelectorAll(".brightness-slider")
  const tempButtons = document.querySelectorAll(".temp-btn")
  const currentTemp = document.getElementById("currentTemp")
  const doorBtn = document.querySelector(".door-btn")
  const musicButtons = document.querySelectorAll(".music-btn")
  const sceneButtons = document.querySelectorAll(".scene-btn")

  // DOM Elements - Calendar
  const prevMonthBtn = document.getElementById("prevMonth")
  const nextMonthBtn = document.getElementById("nextMonth")
  const currentMonthEl = document.getElementById("currentMonth")
  const calendarGrid = document.getElementById("calendarGrid")
  const eventsList = document.getElementById("eventsList")
  const addEventBtn = document.getElementById("addEventBtn")
  const addEventModal = document.getElementById("addEventModal")
  const eventForm = document.getElementById("eventForm")
  const cancelEventBtn = document.getElementById("cancelEventBtn")

  // DOM Elements - Tasks
  const newTaskInput = document.getElementById("newTaskInput")
  const addTaskBtn = document.getElementById("addTaskBtn")
  const tasksList = document.getElementById("tasksList")
  const taskFilters = document.querySelectorAll(".task-filter")

  // DOM Elements - News
  const newsCategories = document.querySelectorAll(".news-category")
  const newsList = document.getElementById("newsList")
  const readNewsBtn = document.getElementById("readNewsBtn")

  // Audio Context for Visualizer
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const analyser = audioContext.createAnalyser()
  const audioVisualizer = document.getElementById("audioVisualizer") // Declared audioVisualizer
  const canvasCtx = audioVisualizer.getContext("2d")

  // Speech recognition setup
  let recognition = null
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = languageSelect.value
  }

  // Speech synthesis setup
  const synth = window.speechSynthesis
  let voices = []

  // State variables
  let currentUser = {
    name: "Guest",
    avatar: "/placeholder.svg?height=50&width=50",
    preferences: {
      language: "en-US",
      theme: "dark",
      voice: null,
    },
  }

  const registeredFaces = []
  const currentDate = new Date()
  const events = [
    {
      title: "Team Meeting",
      date: new Date(2025, 4, 15, 9, 0),
      location: "Conference Room A",
      description: "Weekly team sync",
    },
    {
      title: "Lunch with Client",
      date: new Date(2025, 4, 15, 13, 30),
      location: "Downtown Cafe",
      description: "Discuss project requirements",
    },
  ]

  let tasks = [
    {
      id: 1,
      text: "Prepare presentation for meeting",
      completed: false,
    },
    {
      id: 2,
      text: "Send email to team",
      completed: true,
    },
  ]

  let currentTaskFilter = "all"
  let currentNewsCategory = "top"

  // Initialize
  updateDateTime()
  setInterval(updateDateTime, 1000)
  fetchWeather()
  updateSentiment()
  initializeAudioVisualizer()
  loadVoices()
  renderCalendar()
  const renderEvents = () => {} // Declared renderEvents
  renderTasks()
  fetchNews()

  // Get available voices
  function loadVoices() {
    voices = synth.getVoices()

    // Set preferred voice based on language
    setPreferredVoice(languageSelect.value)
  }

  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices
  }

  // Event Listeners - Main Interface
  activateButton.addEventListener("click", toggleListening)
  sendButton.addEventListener("click", processTextCommand)
  commandInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      processTextCommand()
    }
  })

  languageSelect.addEventListener("change", (e) => {
    if (recognition) {
      recognition.lang = e.target.value
    }
    currentUser.preferences.language = e.target.value
    setPreferredVoice(e.target.value)

    // Inform user about language change
    const langName = languageSelect.options[languageSelect.selectedIndex].text
    addResponse(`Language changed to ${langName}`)
    speak(`Language changed to ${langName}`)
  })

  // Event Listeners - Tabs
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.dataset.tab

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Show selected tab content
      tabContents.forEach((content) => content.classList.remove("active"))
      document.getElementById(`${tabName}Tab`).classList.add("active")
    })
  })

  // Event Listeners - Image Analysis
  imageUpload.addEventListener("change", handleImageUpload)
  closeAnalysisBtn.addEventListener("click", () => {
    imageAnalysisPanel.classList.add("hidden")
  })

  // Event Listeners - Face Recognition
  faceRecognitionBtn.addEventListener("click", initFaceRecognition)
  captureBtn.addEventListener("click", captureFace)
  registerBtn.addEventListener("click", registerFace)
  closeFaceBtn.addEventListener("click", () => {
    stopWebcam(webcamVideo)
    faceRecognitionPanel.classList.add("hidden")
  })

  // Event Listeners - Gesture Control
  gestureControlBtn.addEventListener("click", initGestureControl)
  closeGestureBtn.addEventListener("click", () => {
    stopWebcam(gestureVideo)
    gestureControlPanel.classList.add("hidden")
  })

  // Event Listeners - Smart Home
  deviceToggles.forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      const device = e.target.dataset.device
      const isOn = e.target.checked

      // Update UI based on device state
      updateDeviceState(device, isOn)

      // Notify user
      const deviceName = e.target.closest(".device-card").querySelector(".device-name").textContent
      const status = isOn ? "on" : "off"
      addResponse(`${deviceName} turned ${status}`)
    })
  })

  brightnessSliders.forEach((slider) => {
    slider.addEventListener("input", (e) => {
      const device = e.target.dataset.device
      const brightness = e.target.value

      // Update UI based on brightness
      updateDeviceBrightness(device, brightness)
    })
  })

  tempButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const action = e.target.dataset.action
      let temp = Number.parseInt(currentTemp.textContent)

      if (action === "increase") {
        temp = Math.min(temp + 1, 85)
      } else {
        temp = Math.max(temp - 1, 60)
      }

      currentTemp.textContent = temp
    })
  })

  doorBtn.addEventListener("click", () => {
    const isLocked = doorBtn.classList.contains("locked")

    if (isLocked) {
      doorBtn.classList.remove("locked")
      doorBtn.classList.add("unlocked")
      doorBtn.textContent = "Unlocked"
    } else {
      doorBtn.classList.remove("unlocked")
      doorBtn.classList.add("locked")
      doorBtn.textContent = "Locked"
    }

    // Notify user
    const status = isLocked ? "unlocked" : "locked"
    addResponse(`Front door ${status}`)
  })

  musicButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const action = e.target.dataset.action

      // Simulate music control
      let actionText = ""
      switch (action) {
        case "play":
          actionText = "Playing music"
          break
        case "prev":
          actionText = "Previous track"
          break
        case "next":
          actionText = "Next track"
          break
      }

      addResponse(actionText)
    })
  })

  sceneButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const scene = e.target.dataset.scene

      // Apply scene settings
      applyScene(scene)

      // Notify user
      addResponse(`Applied ${scene} scene`)
    })
  })

  // Event Listeners - Calendar
  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1)
    renderCalendar()
  })

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1)
    renderCalendar()
  })

  addEventBtn.addEventListener("click", () => {
    addEventModal.classList.remove("hidden")
  })

  cancelEventBtn.addEventListener("click", () => {
    addEventModal.classList.add("hidden")
  })

  eventForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const title = document.getElementById("eventTitle").value
    const dateStr = document.getElementById("eventDate").value
    const timeStr = document.getElementById("eventTime").value
    const location = document.getElementById("eventLocation").value
    const description = document.getElementById("eventDescription").value

    // Create date object
    const [year, month, day] = dateStr.split("-").map(Number)
    const [hours, minutes] = timeStr.split(":").map(Number)
    const date = new Date(year, month - 1, day, hours, minutes)

    // Add new event
    events.push({
      title,
      date,
      location,
      description,
    })

    // Update UI
    renderCalendar()
    renderEvents()

    // Close modal and reset form
    addEventModal.classList.add("hidden")
    eventForm.reset()

    // Notify user
    addResponse(`Event "${title}" added to calendar`)
  })

  // Event Listeners - Tasks
  addTaskBtn.addEventListener("click", addNewTask)

  newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addNewTask()
    }
  })

  taskFilters.forEach((filter) => {
    filter.addEventListener("click", (e) => {
      const filterType = e.target.dataset.filter

      // Update active filter
      taskFilters.forEach((f) => f.classList.remove("active"))
      e.target.classList.add("active")

      // Update filter and render tasks
      currentTaskFilter = filterType
      renderTasks()
    })
  })

  // Event delegation for task actions
  tasksList.addEventListener("click", (e) => {
    const taskItem = e.target.closest(".task-item")
    if (!taskItem) return

    const taskId = Number.parseInt(taskItem.dataset.id)

    if (e.target.classList.contains("task-delete")) {
      // Delete task
      tasks = tasks.filter((task) => task.id !== taskId)
      renderTasks()
      addResponse("Task deleted")
    } else if (e.target.classList.contains("task-edit")) {
      // Edit task (simplified implementation)
      const task = tasks.find((t) => t.id === taskId)
      const newText = prompt("Edit task:", task.text)

      if (newText && newText.trim() !== "") {
        task.text = newText
        renderTasks()
        addResponse("Task updated")
      }
    } else if (e.target.type === "checkbox") {
      // Toggle completion
      const task = tasks.find((t) => t.id === taskId)
      task.completed = e.target.checked
      renderTasks()
    }
  })

  // Event Listeners - News
  newsCategories.forEach((category) => {
    category.addEventListener("click", (e) => {
      const categoryType = e.target.dataset.category

      // Update active category
      newsCategories.forEach((c) => c.classList.remove("active"))
      e.target.classList.add("active")

      // Update category and fetch news
      currentNewsCategory = categoryType
      fetchNews()
    })
  })

  readNewsBtn.addEventListener("click", () => {
    // Get all news titles
    const titles = Array.from(document.querySelectorAll(".news-title")).map((el) => el.textContent)

    // Read titles aloud
    speak(`Today's top headlines: ${titles.join(". Next: ")}`)
    addResponse("Reading news headlines...")
  })

  // Speech recognition events
  if (recognition) {
    recognition.onstart = () => {
      jarvisInterface.classList.add("listening")
      statusText.textContent = "LISTENING..."
      activateButton.querySelector(".button-text").textContent = "LISTENING..."
      startVisualization()
    }

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript
      commandInput.value = command
      processCommand(command)
    }

    recognition.onend = () => {
      jarvisInterface.classList.remove("listening")
      statusText.textContent = "JARVIS READY"
      activateButton.querySelector(".button-text").textContent = "ACTIVATE JARVIS"
      stopVisualization()
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      addResponse("I couldn't understand that. Please try again.")
      jarvisInterface.classList.remove("listening")
      statusText.textContent = "JARVIS READY"
      activateButton.querySelector(".button-text").textContent = "ACTIVATE JARVIS"
      stopVisualization()
    }
  }

  // Functions - Main Interface
  function toggleListening() {
    if (!recognition) {
      addResponse("Speech recognition is not supported in your browser.")
      return
    }

    if (jarvisInterface.classList.contains("listening")) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  function processTextCommand() {
    const command = commandInput.value.trim()
    if (command) {
      processCommand(command)
      commandInput.value = ""
    }
  }

  function processCommand(command) {
    addResponse(`You: ${command}`, false)

    jarvisInterface.classList.add("processing")
    statusText.textContent = "PROCESSING..."

    // Analyze sentiment
    analyzeSentiment(command)

    // Send command to backend for OpenAI processing
    fetch("/api/process_command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: command,
        language: currentUser.preferences.language,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        jarvisInterface.classList.remove("processing")
        statusText.textContent = "JARVIS READY"

        addResponse(data.text)
        speak(data.text)

        // Handle any actions returned from the backend
        if (data.action) {
          handleAction(data.action, data.data)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        jarvisInterface.classList.remove("processing")
        statusText.textContent = "JARVIS READY"

        // Process command locally if backend fails
        processLocalCommand(command)
      })
  }

  function processLocalCommand(command) {
    command = command.toLowerCase()

    // Basic command processing
    if (command.includes("hello") || command.includes("hi jarvis")) {
      const response = "Hello! I am JARVIS, your personal assistant. How can I help you today?"
      addResponse(response)
      speak(response)
    } else if (command.includes("time")) {
      const response = `The current time is ${new Date().toLocaleTimeString()}.`
      addResponse(response)
      speak(response)
    } else if (command.includes("date")) {
      const response = `Today is ${new Date().toLocaleDateString()}.`
      addResponse(response)
      speak(response)
    } else if (command.includes("weather")) {
      fetchWeather()
      const response = "I'm checking the weather for you."
      addResponse(response)
      speak(response)
    } else if (command.includes("light") || command.includes("lamp")) {
      // Control lights
      const turnOn = command.includes("on") || command.includes("turn on")
      const turnOff = command.includes("off") || command.includes("turn off")

      if (turnOn || turnOff) {
        const livingRoomToggle = document.querySelector('[data-device="living_room_lights"]')
        const bedroomToggle = document.querySelector('[data-device="bedroom_lights"]')

        if (command.includes("living") || command.includes("room")) {
          livingRoomToggle.checked = turnOn
          updateDeviceState("living_room_lights", turnOn)
        } else if (command.includes("bedroom") || command.includes("bed")) {
          bedroomToggle.checked = turnOn
          updateDeviceState("bedroom_lights", turnOn)
        } else {
          // Toggle all lights
          livingRoomToggle.checked = turnOn
          bedroomToggle.checked = turnOn
          updateDeviceState("living_room_lights", turnOn)
          updateDeviceState("bedroom_lights", turnOn)
        }

        const response = turnOn ? "Lights turned on." : "Lights turned off."
        addResponse(response)
        speak(response)
      } else {
        const response = "Would you like me to turn the lights on or off?"
        addResponse(response)
        speak(response)
      }
    } else if (command.includes("temperature") || command.includes("thermostat")) {
      // Control thermostat
      if (command.includes("up") || command.includes("increase") || command.includes("warmer")) {
        let temp = Number.parseInt(currentTemp.textContent)
        temp = Math.min(temp + 1, 85)
        currentTemp.textContent = temp

        const response = `Thermostat increased to ${temp} degrees.`
        addResponse(response)
        speak(response)
      } else if (command.includes("down") || command.includes("decrease") || command.includes("cooler")) {
        let temp = Number.parseInt(currentTemp.textContent)
        temp = Math.max(temp - 1, 60)
        currentTemp.textContent = temp

        const response = `Thermostat decreased to ${temp} degrees.`
        addResponse(response)
        speak(response)
      } else {
        const temp = currentTemp.textContent
        const response = `The current temperature is set to ${temp} degrees.`
        addResponse(response)
        speak(response)
      }
    } else if (command.includes("door") && (command.includes("lock") || command.includes("unlock"))) {
      // Control door lock
      const shouldLock = command.includes("lock") && !command.includes("unlock")

      if (shouldLock) {
        doorBtn.classList.remove("unlocked")
        doorBtn.classList.add("locked")
        doorBtn.textContent = "Locked"

        const response = "Front door locked."
        addResponse(response)
        speak(response)
      } else {
        doorBtn.classList.remove("locked")
        doorBtn.classList.add("unlocked")
        doorBtn.textContent = "Unlocked"

        const response = "Front door unlocked."
        addResponse(response)
        speak(response)
      }
    } else if (command.includes("add task") || command.includes("new task")) {
      // Extract task text
      const taskText = command.replace(/add task|new task/i, "").trim()

      if (taskText) {
        addTask(taskText)

        const response = `Task "${taskText}" added to your list.`
        addResponse(response)
        speak(response)

        // Switch to tasks tab
        document.querySelector('[data-tab="tasks"]').click()
      } else {
        const response = "What task would you like to add?"
        addResponse(response)
        speak(response)
      }
    } else if (command.includes("news") || command.includes("headlines")) {
      // Read news headlines
      const response = "Here are today's top headlines."
      addResponse(response)
      speak(response)

      // Switch to news tab
      document.querySelector('[data-tab="news"]').click()

      // Trigger read news button after a delay
      setTimeout(() => {
        readNewsBtn.click()
      }, 1000)
    } else if (command.includes("calendar") || command.includes("events") || command.includes("schedule")) {
      // Show calendar
      const response = "Here's your calendar."
      addResponse(response)
      speak(response)

      // Switch to calendar tab
      document.querySelector('[data-tab="calendar"]').click()
    } else if (command.includes("smart home") || command.includes("devices")) {
      // Show smart home controls
      const response = "Here are your smart home controls."
      addResponse(response)
      speak(response)

      // Switch to smart home tab
      document.querySelector('[data-tab="smart-home"]').click()
    } else {
      const response =
        "I'm not sure how to respond to that. In a full implementation, I would send this to my backend for processing."
      addResponse(response)
      speak(response)
    }
  }

  function handleAction(action, data) {
    switch (action) {
      case "update_weather":
        updateWeatherDisplay(data)
        break
      case "update_time":
        timeInfo.textContent = data.time
        break
      case "open_url":
        window.open(data.url, "_blank")
        break
      case "show_image_analysis":
        displayImageAnalysis(data)
        break
      case "control_device":
        controlSmartDevice(data.device, data.state)
        break
      case "add_task":
        addTask(data.text)
        break
      case "add_event":
        addEvent(data)
        break
      case "switch_tab":
        document.querySelector(`[data-tab="${data.tab}"]`).click()
        break
    }
  }

  function addResponse(text, isJarvis = true) {
    const p = document.createElement("p")
    p.textContent = isJarvis ? `JARVIS: ${text}` : text
    p.style.marginBottom = "10px"
    responseArea.appendChild(p)
    responseArea.scrollTop = responseArea.scrollHeight
  }

  function speak(text) {
    if (synth && !synth.speaking) {
      // Remove "JARVIS: " prefix if it exists
      const cleanText = text.startsWith("JARVIS: ") ? text.substring(8) : text
      const utterance = new SpeechSynthesisUtterance(cleanText)

      // Set language and voice
      utterance.lang = currentUser.preferences.language
      if (currentUser.preferences.voice) {
        utterance.voice = currentUser.preferences.voice
      }

      utterance.rate = 1
      utterance.pitch = 1
      synth.speak(utterance)
    }
  }

  function setPreferredVoice(language) {
    // Find a voice that matches the selected language
    const languageVoices = voices.filter((voice) => voice.lang.startsWith(language.split("-")[0]))

    if (languageVoices.length > 0) {
      // Prefer male voices if available
      const maleVoice = languageVoices.find(
        (voice) =>
          voice.name.includes("Male") ||
          voice.name.includes("David") ||
          (voice.name.includes("Google") && !voice.name.includes("Female")),
      )

      currentUser.preferences.voice = maleVoice || languageVoices[0]
    } else {
      currentUser.preferences.voice = null
    }
  }

  function updateDateTime() {
    const now = new Date()
    timeInfo.textContent = now.toLocaleTimeString()
  }

  function fetchWeather() {
    // In a real implementation, you would call your Python backend
    // For demo purposes, we'll just simulate a weather response
    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Partly Cloudy"]
    const temperatures = [68, 72, 75, 81, 65, 59]

    const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]
    const temperature = temperatures[Math.floor(Math.random() * temperatures.length)]

    weatherInfo.textContent = `${condition}, ${temperature}°F`
  }

  function updateWeatherDisplay(data) {
    weatherInfo.textContent = `${data.condition}, ${data.temperature}°F`
  }

  function updateSentiment() {
    // In a real implementation, this would be based on actual sentiment analysis
    const sentiments = ["Neutral", "Positive", "Engaged", "Curious"]
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]

    sentimentInfo.textContent = sentiment
  }

  function analyzeSentiment(text) {
    // In a real implementation, you would use NLP to analyze sentiment
    // For demo purposes, we'll use a simple keyword approach
    text = text.toLowerCase()

    if (text.includes("thank") || text.includes("great") || text.includes("awesome") || text.includes("good")) {
      sentimentInfo.textContent = "Positive"
    } else if (text.includes("bad") || text.includes("terrible") || text.includes("awful") || text.includes("hate")) {
      sentimentInfo.textContent = "Negative"
    } else if (text.includes("why") || text.includes("how") || text.includes("what") || text.includes("when")) {
      sentimentInfo.textContent = "Curious"
    } else if (text.includes("help") || text.includes("need") || text.includes("please")) {
      sentimentInfo.textContent = "Requesting"
    } else {
      sentimentInfo.textContent = "Neutral"
    }
  }

  // Functions - Image Analysis
  function handleImageUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    // Display loading state
    imageAnalysisPanel.classList.remove("hidden")
    analyzedImage.src = URL.createObjectURL(file)
    analysisResults.innerHTML = "<p>Analyzing image...</p>"

    // Create FormData and send to backend
    const formData = new FormData()
    formData.append("image", file)

    fetch("/api/analyze_image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        displayImageAnalysis(data)
      })
      .catch((error) => {
        console.error("Error:", error)
        analysisResults.innerHTML = "<p>Error analyzing image. Please try again.</p>"

        // Simulate analysis for demo purposes
        setTimeout(() => {
          simulateImageAnalysis()
        }, 1000)
      })
  }

  function displayImageAnalysis(data) {
    let resultsHTML = "<h4>Analysis Results:</h4>"

    if (data.objects && data.objects.length > 0) {
      resultsHTML += "<p><strong>Objects Detected:</strong></p><ul>"
      data.objects.forEach((obj) => {
        resultsHTML += `<li>${obj.name} (${Math.round(obj.confidence * 100)}% confidence)</li>`
      })
      resultsHTML += "</ul>"
    }

    if (data.description) {
      resultsHTML += `<p><strong>Description:</strong> ${data.description}</p>`
    }

    if (data.tags && data.tags.length > 0) {
      resultsHTML += "<p><strong>Tags:</strong> "
      resultsHTML += data.tags.join(", ")
      resultsHTML += "</p>"
    }

    if (data.colors && data.colors.length > 0) {
      resultsHTML += "<p><strong>Dominant Colors:</strong></p>"
      resultsHTML += "<div style='display: flex; gap: 5px; margin-top: 5px;'>"
      data.colors.forEach((color) => {
        const percentage = Math.round(color.percentage * 100)
        resultsHTML += `<div style='background-color: ${color.hex}; width: ${percentage}px; height: 20px; border-radius: 3px;' title='${color.hex} (${percentage}%)'></div>`
      })
      resultsHTML += "</div>"
    }

    analysisResults.innerHTML = resultsHTML
  }

  function simulateImageAnalysis() {
    // Simulate image analysis for demo purposes
    const simulatedData = {
      objects: [
        { name: "Person", confidence: 0.98 },
        { name: "Building", confidence: 0.85 },
        { name: "Car", confidence: 0.75 },
        { name: "Tree", confidence: 0.82 },
      ],
      description: "A person standing next to a car in front of a building on a sunny day.",
      tags: ["outdoor", "vehicle", "sunny", "daytime", "urban", "architecture"],
      colors: [
        { hex: "#4287f5", rgb: [66, 135, 245], percentage: 0.3 },
        { hex: "#42f5a7", rgb: [66, 245, 167], percentage: 0.25 },
        { hex: "#f54242", rgb: [245, 66, 66], percentage: 0.2 },
        { hex: "#f5f542", rgb: [245, 245, 66], percentage: 0.15 },
        { hex: "#8c42f5", rgb: [140, 66, 245], percentage: 0.1 },
      ],
    }

    displayImageAnalysis(simulatedData)
  }

  // Functions - Face Recognition
  function initFaceRecognition() {
    faceRecognitionPanel.classList.remove("hidden")
    recognitionResults.innerHTML = "<p>Initializing camera...</p>"

    // Start webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          webcamVideo.srcObject = stream
          recognitionResults.innerHTML = "<p>Camera ready. Looking for faces...</p>"

          // Start face detection
          startFaceDetection()
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err)
          recognitionResults.innerHTML = "<p>Error accessing camera. Please check permissions.</p>"
        })
    } else {
      recognitionResults.innerHTML = "<p>Your browser doesn't support webcam access.</p>"
    }
  }

  function startFaceDetection() {
    // In a real implementation, you would use a face detection library
    // For demo purposes, we'll simulate face detection
    setTimeout(() => {
      recognitionResults.innerHTML = "<p>Face detected! I can see you.</p>"

      // Draw a face rectangle on canvas
      const ctx = faceCanvas.getContext("2d")
      faceCanvas.width = webcamVideo.videoWidth
      faceCanvas.height = webcamVideo.videoHeight

      // Simulate face rectangle
      ctx.strokeStyle = "#64ffda"
      ctx.lineWidth = 2

      const centerX = faceCanvas.width / 2
      const centerY = faceCanvas.height / 2
      const width = faceCanvas.width / 3
      const height = faceCanvas.height / 2

      ctx.strokeRect(centerX - width / 2, centerY - height / 2, width, height)

      // Check if face is recognized
      if (registeredFaces.length > 0) {
        setTimeout(() => {
          const recognizedUser = registeredFaces[0]
          recognitionResults.innerHTML = `<p>Face recognized! Hello, ${recognizedUser.name}!</p>`

          // Update user info
          updateUserProfile(recognizedUser)

          // Speak greeting
          speak(`Hello, ${recognizedUser.name}! Welcome back.`)
        }, 1000)
      }
    }, 2000)
  }

  function captureFace() {
    // Capture current frame from video
    const canvas = document.createElement("canvas")
    canvas.width = webcamVideo.videoWidth
    canvas.height = webcamVideo.videoHeight
    canvas.getContext("2d").drawImage(webcamVideo, 0, 0, canvas.width, canvas.height)

    // In a real implementation, you would process this image for face recognition
    recognitionResults.innerHTML = "<p>Face captured! Ready to register or verify.</p>"
  }

  function registerFace() {
    // In a real implementation, you would extract face features and store them
    const name = prompt("Enter your name:")

    if (name && name.trim() !== "") {
      // Create a user profile
      const newUser = {
        name: name,
        avatar: "/placeholder.svg?height=50&width=50", // In real app, use captured face
        preferences: {
          language: currentUser.preferences.language,
          theme: "dark",
          voice: currentUser.preferences.voice,
        },
      }

      registeredFaces.push(newUser)
      updateUserProfile(newUser)

      recognitionResults.innerHTML = `<p>Face registered! Hello, ${name}!</p>`
      speak(`Face registered! Hello, ${name}! I'll remember you next time.`)
    }
  }

  function updateUserProfile(user) {
    currentUser = user
    userName.textContent = user.name
    userAvatar.querySelector("img").src = user.avatar
  }

  // Functions - Gesture Control
  function initGestureControl() {
    gestureControlPanel.classList.remove("hidden")
    gestureStatus.innerHTML = "<p>Initializing camera...</p>"

    // Start webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          gestureVideo.srcObject = stream
          gestureStatus.innerHTML = "<p>Camera ready. Waiting for gestures...</p>"

          // Start gesture detection
          startGestureDetection()
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err)
          gestureStatus.innerHTML = "<p>Error accessing camera. Please check permissions.</p>"
        })
    } else {
      gestureStatus.innerHTML = "<p>Your browser doesn't support webcam access.</p>"
    }
  }

  function startGestureDetection() {
    // In a real implementation, you would use a gesture detection library
    // For demo purposes, we'll simulate gesture detection

    // Set up canvas
    const ctx = gestureCanvas.getContext("2d")
    gestureCanvas.width = gestureVideo.videoWidth
    gestureCanvas.height = gestureVideo.videoHeight

    // Simulate gesture detection with random gestures
    const gestures = ["Point Up", "Point Down", "Open Palm", "Fist", "Point Left", "Point Right"]

    const gestureInterval = setInterval(() => {
      // Clear canvas
      ctx.clearRect(0, 0, gestureCanvas.width, gestureCanvas.height)

      // 20% chance to detect a gesture
      if (Math.random() < 0.2) {
        const gesture = gestures[Math.floor(Math.random() * gestures.length)]
        gestureStatus.innerHTML = `<p>Gesture detected: ${gesture}</p>`

        // Draw gesture indicator
        ctx.fillStyle = "rgba(100, 255, 218, 0.5)"
        ctx.strokeStyle = "#64ffda"
        ctx.lineWidth = 2

        switch (gesture) {
          case "Point Up":
            drawArrow(ctx, gestureCanvas.width / 2, gestureCanvas.height / 2, 0, -50)
            simulateGestureAction("Volume Up")
            break
          case "Point Down":
            drawArrow(ctx, gestureCanvas.width / 2, gestureCanvas.height / 2, 0, 50)
            simulateGestureAction("Volume Down")
            break
          case "Open Palm":
            ctx.beginPath()
            ctx.arc(gestureCanvas.width / 2, gestureCanvas.height / 2, 50, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
            simulateGestureAction("Pause/Play")
            break
          case "Fist":
            ctx.fillRect(gestureCanvas.width / 2 - 30, gestureCanvas.height / 2 - 30, 60, 60)
            ctx.strokeRect(gestureCanvas.width / 2 - 30, gestureCanvas.height / 2 - 30, 60, 60)
            simulateGestureAction("Stop")
            break
          case "Point Left":
            drawArrow(ctx, gestureCanvas.width / 2, gestureCanvas.height / 2, -50, 0)
            simulateGestureAction("Previous")
            break
          case "Point Right":
            drawArrow(ctx, gestureCanvas.width / 2, gestureCanvas.height / 2, 50, 0)
            simulateGestureAction("Next")
            break
        }
      } else {
        gestureStatus.innerHTML = "<p>Waiting for gesture...</p>"
      }
    }, 2000)

    // Store interval ID to clear it when closing the panel
    gestureControlPanel.dataset.intervalId = gestureInterval
  }

  function drawArrow(ctx, x, y, dx, dy) {
    const headLength = 15
    const angle = Math.atan2(dy, dx)

    // Draw line
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + dx, y + dy)
    ctx.stroke()

    // Draw arrowhead
    ctx.beginPath()
    ctx.moveTo(x + dx, y + dy)
    ctx.lineTo(x + dx - headLength * Math.cos(angle - Math.PI / 6), y + dy - headLength * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(x + dx - headLength * Math.cos(angle + Math.PI / 6), y + dy - headLength * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fill()
  }

  function simulateGestureAction(action) {
    // Simulate action based on gesture
    addResponse(`Gesture action: ${action}`)

    // Perform action
    switch (action) {
      case "Volume Up":
        // Simulate volume up
        break
      case "Volume Down":
        // Simulate volume down
        break
      case "Pause/Play":
        // Simulate play/pause
        document.querySelector('[data-action="play"]').click()
        break
      case "Stop":
        // Simulate stop
        break
      case "Previous":
        // Simulate previous
        document.querySelector('[data-action="prev"]').click()
        break
      case "Next":
        // Simulate next
        document.querySelector('[data-action="next"]').click()
        break
    }
  }

  function stopWebcam(videoElement) {
    if (videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoElement.srcObject = null
    }

    // Clear any intervals
    if (videoElement.closest(".modal").dataset.intervalId) {
      clearInterval(Number.parseInt(videoElement.closest(".modal").dataset.intervalId))
    }
  }

  // Functions - Smart Home
  function updateDeviceState(device, isOn) {
    const deviceCard = document.querySelector(`[data-device="${device}"]`).closest(".device-card")

    if (isOn) {
      deviceCard.style.opacity = "1"
    } else {
      deviceCard.style.opacity = "0.5"
    }
  }

  function updateDeviceBrightness(device, brightness) {
    const deviceCard = document.querySelector(`[data-device="${device}"]`).closest(".device-card")
    const deviceIcon = deviceCard.querySelector(".device-icon")

    // Update icon brightness
    deviceIcon.style.opacity = brightness / 100
  }

  function controlSmartDevice(device, state) {
    const deviceToggle = document.querySelector(`[data-device="${device}"]`)

    if (deviceToggle) {
      deviceToggle.checked = state.on
      updateDeviceState(device, state.on)

      if (state.brightness !== undefined) {
        const brightnessSlider = document.querySelector(`[data-device="${device}"].brightness-slider`)
        if (brightnessSlider) {
          brightnessSlider.value = state.brightness
          updateDeviceBrightness(device, state.brightness)
        }
      }
    }
  }

  function applyScene(scene) {
    // Apply scene settings to devices
    switch (scene) {
      case "morning":
        // Morning scene
        controlSmartDevice("living_room_lights", { on: true, brightness: 100 })
        controlSmartDevice("bedroom_lights", { on: true, brightness: 80 })
        currentTemp.textContent = "72"
        break
      case "evening":
        // Evening scene
        controlSmartDevice("living_room_lights", { on: true, brightness: 60 })
        controlSmartDevice("bedroom_lights", { on: true, brightness: 40 })
        currentTemp.textContent = "70"
        break
      case "movie":
        // Movie scene
        controlSmartDevice("living_room_lights", { on: true, brightness: 20 })
        controlSmartDevice("bedroom_lights", { on: false })
        controlSmartDevice("tv", { on: true })
        break
      case "away":
        // Away scene
        controlSmartDevice("living_room_lights", { on: false })
        controlSmartDevice("bedroom_lights", { on: false })
        controlSmartDevice("tv", { on: false })
        controlSmartDevice("music", { on: false })
        doorBtn.classList.remove("unlocked")
        doorBtn.classList.add("locked")
        doorBtn.textContent = "Locked"
        currentTemp.textContent = "65"
        break
    }
  }

  // Functions - Calendar
  function renderCalendar() {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Update month display
    currentMonthEl.textContent = new Date(year, month, 1).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    })

    // Clear grid
    calendarGrid.innerHTML = ""

    // Add day headers
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    dayNames.forEach((day) => {
      const dayEl = document.createElement("div")
      dayEl.textContent = day
      dayEl.classList.add("calendar-day", "day-header")
      calendarGrid.appendChild(dayEl)
    })

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Get days from previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayEl = document.createElement("div")
      dayEl.textContent = daysInPrevMonth - i
      dayEl.classList.add("calendar-day", "other-month")
      calendarGrid.appendChild(dayEl)
    }

    // Add days of current month
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement("div")
      dayEl.textContent = i
      dayEl.classList.add("calendar-day")

      // Check if it's today
      if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
        dayEl.classList.add("today")
      }

      // Check if day has events
      const dayDate = new Date(year, month, i)
      const hasEvent = events.some(
        (event) =>
          event.date.getFullYear() === dayDate.getFullYear() &&
          event.date.getMonth() === dayDate.getMonth() &&
          event.date.getDate() === dayDate.getDate(),
      )

      if (hasEvent) {
        dayEl.classList.add("has-event")
      }

      // Add click event to show events for that day
      dayEl.addEventListener("click", () => {
        const selectedDate = new Date(year, month, i)
        showEventsForDate(selectedDate)
      })

      calendarGrid.appendChild(dayEl)
    }

    // Fill remaining grid with days from next month
    const totalDays = firstDay + daysInMonth
    const remainingDays = 7 - (totalDays % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const dayEl = document.createElement("div")
        dayEl.textContent = i
        dayEl.classList.add("calendar-day", "other-month")
        calendarGrid.appendChild(dayEl)
      }
    }

    // Show events for current date
    showEventsForDate(new Date())
  }

  function showEventsForDate(date) {
    // Filter events for the selected date
    const dayEvents = events.filter(
      (event) =>
        event.date.getFullYear() === date.getFullYear() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getDate() === date.getDate(),
    )

    // Sort events by time
    dayEvents.sort((a, b) => a.date - b.date)

    // Update events list
    eventsList.innerHTML = ""

    if (dayEvents.length === 0) {
      const noEventsEl = document.createElement("div")
      noEventsEl.textContent = "No events for this day"
      noEventsEl.classList.add("no-events")
      eventsList.appendChild(noEventsEl)
    } else {
      dayEvents.forEach((event) => {
        const eventEl = document.createElement("div")
        eventEl.classList.add("event-item")

        const timeEl = document.createElement("div")
        timeEl.classList.add("event-time")
        timeEl.textContent = event.date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })

        const detailsEl = document.createElement("div")
        detailsEl.classList.add("event-details")

        const titleEl = document.createElement("div")
        titleEl.classList.add("event-title")
        titleEl.textContent = event.title

        const locationEl = document.createElement("div")
        locationEl.classList.add("event-location")
        locationEl.textContent = event.location || "No location"

        detailsEl.appendChild(titleEl)
        detailsEl.appendChild(locationEl)

        eventEl.appendChild(timeEl)
        eventEl.appendChild(detailsEl)

        eventsList.appendChild(eventEl)
      })
    }
  }

  function addEvent(eventData) {
    // Create date object
    const date = new Date(eventData.date)

    // Add new event
    events.push({
      title: eventData.title,
      date: date,
      location: eventData.location,
      description: eventData.description,
    })

    // Update UI
    renderCalendar()
  }

  // Functions - Tasks
  function addNewTask() {
    const taskText = newTaskInput.value.trim()

    if (taskText) {
      addTask(taskText)
      newTaskInput.value = ""
    }
  }

  function addTask(text) {
    // Generate unique ID
    const id = Date.now()

    // Add task to array
    tasks.push({
      id: id,
      text: text,
      completed: false,
    })

    // Render tasks
    renderTasks()
  }

  function renderTasks() {
    // Filter tasks based on current filter
    let filteredTasks = tasks

    if (currentTaskFilter === "active") {
      filteredTasks = tasks.filter((task) => !task.completed)
    } else if (currentTaskFilter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed)
    }

    // Clear list
    tasksList.innerHTML = ""

    // Add tasks
    filteredTasks.forEach((task) => {
      const taskEl = document.createElement("div")
      taskEl.classList.add("task-item")
      taskEl.dataset.id = task.id

      if (task.completed) {
        taskEl.classList.add("completed")
      }

      const checkboxLabel = document.createElement("label")
      checkboxLabel.classList.add("task-checkbox")

      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.checked = task.completed

      const checkmark = document.createElement("span")
      checkmark.classList.add("checkmark")

      checkboxLabel.appendChild(checkbox)
      checkboxLabel.appendChild(checkmark)

      const textEl = document.createElement("div")
      textEl.classList.add("task-text")
      textEl.textContent = task.text

      const actionsEl = document.createElement("div")
      actionsEl.classList.add("task-actions")

      const editBtn = document.createElement("button")
      editBtn.classList.add("task-edit")
      editBtn.textContent = "✏️"

      const deleteBtn = document.createElement("button")
      deleteBtn.classList.add("task-delete")
      deleteBtn.textContent = "🗑️"

      actionsEl.appendChild(editBtn)
      actionsEl.appendChild(deleteBtn)

      taskEl.appendChild(checkboxLabel)
      taskEl.appendChild(textEl)
      taskEl.appendChild(actionsEl)

      tasksList.appendChild(taskEl)
    })
  }

  // Functions - News
  function fetchNews() {
    // In a real implementation, you would fetch news from an API
    // For demo purposes, we'll simulate news data

    // Clear news list
    newsList.innerHTML = ""

    // Generate random news items based on category
    const newsItems = generateNewsItems(currentNewsCategory, 5)

    // Add news items to list
    newsItems.forEach((item) => {
      const newsEl = document.createElement("div")
      newsEl.classList.add("news-item")

      const imageEl = document.createElement("div")
      imageEl.classList.add("news-image")

      const img = document.createElement("img")
      img.src = item.image || "/placeholder.svg?height=80&width=120"
      img.alt = "News"

      imageEl.appendChild(img)

      const contentEl = document.createElement("div")
      contentEl.classList.add("news-content")

      const titleEl = document.createElement("div")
      titleEl.classList.add("news-title")
      titleEl.textContent = item.title

      const sourceEl = document.createElement("div")
      sourceEl.classList.add("news-source")
      sourceEl.textContent = `${item.source} • ${item.time}`

      const summaryEl = document.createElement("div")
      summaryEl.classList.add("news-summary")
      summaryEl.textContent = item.summary

      contentEl.appendChild(titleEl)
      contentEl.appendChild(sourceEl)
      contentEl.appendChild(summaryEl)

      newsEl.appendChild(imageEl)
      newsEl.appendChild(contentEl)

      newsList.appendChild(newsEl)
    })
  }

  function generateNewsItems(category, count) {
    const items = []
    const sources = ["Tech Daily", "World Report", "Science News", "Business Insider", "Health Today"]
    const times = ["1 hour ago", "2 hours ago", "3 hours ago", "4 hours ago", "5 hours ago"]

    // Generate news based on category
    let titles = []
    let summaries = []

    switch (category) {
      case "technology":
        titles = [
          "AI Breakthrough Promises New Era of Computing",
          "Tech Giants Announce Collaboration on Quantum Computing",
          "New Smartphone Features Revolutionary Battery Technology",
          "Cybersecurity Experts Warn of Emerging Threats",
          "Virtual Reality Headsets See Surge in Adoption",
        ]
        summaries = [
          "Researchers have developed a new AI algorithm that could revolutionize how computers process information...",
          "Leading tech companies are joining forces to accelerate quantum computing research and development...",
          "A startup has unveiled a smartphone battery that can last up to a week on a single charge...",
          "A new report highlights increasing sophistication in cyber attacks targeting critical infrastructure...",
          "Sales of VR headsets have doubled in the past year as more compelling content becomes available...",
        ]
        break
      case "business":
        titles = [
          "Global Markets React to Economic Policy Changes",
          "Startup Secures Record-Breaking Funding Round",
          "Retail Giant Announces Expansion into New Markets",
          "Supply Chain Innovations Reduce Costs for Manufacturers",
          "Cryptocurrency Regulations Evolve Across Major Economies",
        ]
        summaries = [
          "Stock markets worldwide showed significant movement following the announcement of new economic policies...",
          "A tech startup has secured $500 million in Series C funding, setting a new industry record...",
          "The retail corporation plans to open 200 new stores across emerging markets in the next two years...",
          "New logistics technologies are helping manufacturers cut supply chain costs by up to 30 percent...",
          "Governments are introducing more comprehensive frameworks for regulating digital currencies...",
        ]
        break
      case "science":
        titles = [
          "Astronomers Discover Potentially Habitable Exoplanet",
          "Breakthrough in Renewable Energy Storage Efficiency",
          "Gene Editing Technique Shows Promise for Treating Genetic Disorders",
          "Climate Scientists Develop More Accurate Prediction Models",
          "Particle Physicists Report Unexpected Experimental Results",
        ]
        summaries = [
          "A planet orbiting a nearby star appears to have conditions that could support life as we know it...",
          "A new material could increase energy storage capacity of batteries by up to 40 percent...",
          "Researchers have refined CRISPR techniques to address previously untreatable genetic conditions...",
          "New climate models incorporate additional variables for more precise long-term forecasting...",
          "Experiments at the Large Hadron Collider have produced results that challenge existing theories...",
        ]
        break
      case "health":
        titles = [
          "New Treatment Approach Shows Promise for Chronic Conditions",
          "Study Reveals Unexpected Benefits of Regular Exercise",
          "Nutrition Research Challenges Long-held Dietary Guidelines",
          "Mental Health Awareness Programs Expand Nationwide",
          "Wearable Health Monitors Become More Sophisticated",
        ]
        summaries = [
          "Clinical trials for a new therapeutic approach have shown significant improvements for patients...",
          "Researchers have discovered that even short bursts of physical activity provide substantial health benefits...",
          "A comprehensive review of nutrition studies suggests some dietary recommendations may need revision...",
          "Schools and workplaces are implementing expanded mental health resources and education...",
          "The latest generation of health wearables can track more vital signs with medical-grade accuracy...",
        ]
        break
      default: // top stories
        titles = [
          "AI Breakthrough Promises New Era of Computing",
          "Global Climate Summit Reaches Historic Agreement",
          "Astronomers Discover Potentially Habitable Exoplanet",
          "Global Markets React to Economic Policy Changes",
          "New Treatment Approach Shows Promise for Chronic Conditions",
        ]
        summaries = [
          "Researchers have developed a new AI algorithm that could revolutionize how computers process information...",
          "World leaders have agreed to ambitious new targets for reducing carbon emissions...",
          "A planet orbiting a nearby star appears to have conditions that could support life as we know it...",
          "Stock markets worldwide showed significant movement following the announcement of new economic policies...",
          "Clinical trials for a new therapeutic approach have shown significant improvements for patients...",
        ]
    }

    // Create news items
    for (let i = 0; i < count; i++) {
      items.push({
        title: titles[i],
        source: sources[Math.floor(Math.random() * sources.length)],
        time: times[Math.floor(Math.random() * times.length)],
        summary: summaries[i],
        image: `/placeholder.svg?height=80&width=120`,
      })
    }

    return items
  }

  // Audio Visualizer
  function initializeAudioVisualizer() {
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    canvasCtx.clearRect(0, 0, audioVisualizer.width, audioVisualizer.height)

    function draw() {
      const drawVisual = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      canvasCtx.clearRect(0, 0, audioVisualizer.width, audioVisualizer.height)

      const centerX = audioVisualizer.width / 2
      const centerY = audioVisualizer.height / 2
      const radius = 70

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i]
        const percent = value / 255

        const angle = (i * 2 * Math.PI) / bufferLength
        const length = percent * radius

        const x1 = centerX + Math.cos(angle) * radius
        const y1 = centerY + Math.sin(angle) * radius
        const x2 = centerX + Math.cos(angle) * (radius + length)
        const y2 = centerY + Math.sin(angle) * (radius + length)

        canvasCtx.strokeStyle = `rgba(100, 255, 218, ${percent})`
        canvasCtx.lineWidth = 2
        canvasCtx.beginPath()
        canvasCtx.moveTo(x1, y1)
        canvasCtx.lineTo(x2, y2)
        canvasCtx.stroke()
      }
    }

    draw()
  }

  function startVisualization() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const source = audioContext.createMediaStreamSource(stream)
          source.connect(analyser)
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err)
        })
    }
  }

  function stopVisualization() {
    // In a real implementation, you would disconnect the audio source
    // For this demo, we'll just let the visualization fade out naturally
  }

  // Initial greeting
  setTimeout(() => {
    speak("Hello, I am JARVIS. How can I assist you today?")
  }, 1000)
})

// Set up event listeners
function setupEventListeners() {
  // Play/Pause button
  playPauseBtn.addEventListener("click", togglePlayPause)

  // Speed buttons
  speedBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Update active button
      speedBtns.forEach((b) => b.classList.remove("active"))
      e.target.classList.add("active")

      // Update speed
      slideSpeed = Number.parseInt(e.target.dataset.speed)
      timerCount = slideSpeed / 1000

      // Restart autoplay if it's currently playing
      if (isPlaying) {
        clearInterval(slideInterval)
        clearInterval(progressInterval)
        startAutoPlay()
      }
    })
  })

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      changeSlide(-1)
    } else if (e.key === "ArrowRight") {
      changeSlide(1)
    } else if (e.key === " ") {
      // Space bar
      togglePlayPause()
      e.preventDefault() // Prevent page scrolling
    } else if (e.key === "f") {
      toggleFullscreen()
    }
  })

  // Touch swipe support
  let touchStartX = 0
  let touchEndX = 0

  slideshowContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX
    },
    false,
  )

  slideshowContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    },
    false,
  )

  function handleSwipe() {
    const swipeThreshold = 50
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next slide
      changeSlide(1)
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous slide
      changeSlide(-1)
    }
  }

  // Fullscreen button
  fullscreenBtn.addEventListener("click", toggleFullscreen)

  // Transition select
  transitionSelect.addEventListener("change", (e) => {
    currentTransition = e.target.value
    updateTransitionClass()
  })

  // Social sharing buttons
  shareBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const platform = e.target.dataset.platform
      shareSlide(platform)
    })
  })

  // Zoom functionality
  zoomableImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.target.classList.toggle("zoomed")
    })
  })

  // Pause video slides when changing slides
  const videos = document.querySelectorAll("video")
  videos.forEach((video) => {
    video.addEventListener("play", () => {
      if (isPlaying) {
        stopAutoPlay()
      }
    })
  })
}

// Show a specific slide
function showSlide(n) {
  // Reset slide index if out of bounds
  if (n > slides.length) {
    slideIndex = 1
  } else if (n < 1) {
    slideIndex = slides.length
  } else {
    slideIndex = n
  }

  // Hide all slides and remove active class
  slides.forEach((slide) => {
    slide.style.display = "none"
    slide.classList.remove("slide-active")
  })

  // Remove active class from all dots and thumbnails
  dots.forEach((dot) => {
    dot.classList.remove("active-dot")
  })

  thumbnails.forEach((thumbnail) => {
    thumbnail.classList.remove("active")
  })

  // Show the current slide and activate its dot and thumbnail
  slides[slideIndex - 1].style.display = "block"
  setTimeout(() => {
    slides[slideIndex - 1].classList.add("slide-active")
  }, 10)
  dots[slideIndex - 1].classList.add("active-dot")
  thumbnails[slideIndex - 1].classList.add("active")

  // Pause all videos when changing slides
  const videos = document.querySelectorAll("video")
  videos.forEach((video) => {
    video.pause()
  })

  // Update transition class
  updateTransitionClass()
}

// Update transition class based on selected transition
function updateTransitionClass() {
  slides.forEach((slide) => {
    slide.classList.remove("fade", "slide-transition", "zoom-transition", "flip-transition")

    if (currentTransition === "fade") {
      slide.classList.add("fade")
    } else if (currentTransition === "slide") {
      slide.classList.add("slide-transition")
      slide.style.animationName = "slide-transition"
    } else if (currentTransition === "zoom") {
      slide.classList.add("slide-transition")
      slide.style.animationName = "zoom-transition"
    } else if (currentTransition === "flip") {
      slide.classList.add("slide-transition")
      slide.style.animationName = "flip-transition"
    }
  })
}

// Change slide (previous/next)
function changeSlide(n) {
  showSlide((slideIndex += n))

  // Reset progress bar and timer if autoplay is active
  if (isPlaying) {
    resetProgress()
  }
}

// Go to a specific slide (when clicking on dots or thumbnails)
function currentSlide(n) {
  showSlide((slideIndex = n))

  // Reset progress bar and timer if autoplay is active
  if (isPlaying) {
    resetProgress()
  }
}

// Toggle play/pause
function togglePlayPause() {
  if (isPlaying) {
    stopAutoPlay()
  } else {
    startAutoPlay()
  }
}

// Start auto-play
function startAutoPlay() {
  isPlaying = true
  playIcon.classList.add("hidden")
  pauseIcon.classList.remove("hidden")

  // Start the slide interval
  slideInterval = setInterval(() => {
    changeSlide(1)
  }, slideSpeed)

  // Start progress bar and timer
  startProgress()
}

// Stop auto-play
function stopAutoPlay() {
  isPlaying = false
  playIcon.classList.remove("hidden")
  pauseIcon.classList.add("hidden")
  clearInterval(slideInterval)
  clearInterval(progressInterval)

  // Reset progress bar
  progressBar.style.width = "0%"
}

// Start progress bar and timer
function startProgress() {
  // Reset first
  resetProgress()

  // Start progress interval
  const updateFrequency = 50 // Update every 50ms for smooth animation
  const progressIncrement = (updateFrequency / slideSpeed) * 100

  progressInterval = setInterval(() => {
    // Update progress bar
    const currentWidth = Number.parseFloat(progressBar.style.width) || 0
    progressBar.style.width = currentWidth + progressIncrement + "%"

    // Update timer
    if (currentWidth % (100 / (slideSpeed / 1000)) < progressIncrement) {
      timerCount -= 1
      timerDisplay.textContent = timerCount
    }

    // Reset when reaching 100%
    if (currentWidth >= 100) {
      resetProgress()
    }
  }, updateFrequency)
}

// Reset progress bar and timer
function resetProgress() {
  clearInterval(progressInterval)
  progressBar.style.width = "0%"
  timerCount = slideSpeed / 1000
  timerDisplay.textContent = timerCount

  if (isPlaying) {
    startProgress()
  }
}

// Toggle fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    slideshowContainer.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

// Share slide on social media
function shareSlide(platform) {
  const url = encodeURIComponent(window.location.href)
  const title = encodeURIComponent("Check out this awesome slideshow!")

  let shareUrl = ""

  switch (platform) {
    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      break
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
      break
    case "pinterest":
      // Get the current slide image
      const currentSlide = slides[slideIndex - 1]
      const image = currentSlide.querySelector("img")
      const imageUrl = image ? encodeURIComponent(image.src) : ""
      shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${imageUrl}&description=${title}`
      break
  }

  if (shareUrl) {
    window.open(shareUrl, "_blank", "width=600,height=400")
  }
}

// Pause slideshow when tab is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isPlaying) {
    clearInterval(slideInterval)
    clearInterval(progressInterval)
  } else if (!document.hidden && isPlaying) {
    clearInterval(slideInterval)
    clearInterval(progressInterval)
    startAutoPlay()
  }
})

// Preload images for smoother transitions
function preloadImages() {
  const images = document.querySelectorAll(".slide img, .thumbnail img")
  images.forEach((img) => {
    const src = img.getAttribute("src")
    if (src) {
      const newImg = new Image()
      newImg.src = src
      newImg.crossOrigin = "anonymous"
    }
  })
}

// Call preload function
preloadImages()
