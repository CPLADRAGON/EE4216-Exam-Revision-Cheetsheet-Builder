export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CHEATSHEET = 'CHEATSHEET',
  PRACTICE = 'PRACTICE',
  CONCEPTS = 'CONCEPTS'
}

export interface TopicSummary {
  title: string;
  content: string;
  codeSnippet?: string;
}

export interface Question {
  id: number;
  type: 'error_spotting' | 'fill_blank' | 'concept';
  question: string;
  codeContext?: string;
  answer: string;
  explanation: string;
}

export interface CheatSheetItem {
  title: string;
  code: string;
  explanation: string;
}

export interface CheatSheetSection {
  category: string;
  items: CheatSheetItem[];
}

export const CHEAT_SHEET_DATA: CheatSheetSection[] = [
  {
    category: "1. C/C++ & Bitwise Logic",
    items: [
      {
        title: "Data Types",
        code: "uint8_t (0-255), int8_t (-128 to 127)\nuint16_t (0-65535), uint32_t (0-4B)\nbool (true/false), float (4 bytes)",
        explanation: "Use `stdint.h` types for precise control. `uint8_t` is standard for register manipulation. `volatile` keyword is required for variables modified inside an ISR."
      },
      {
        title: "Bitwise Manipulation",
        code: "Set bit N:   val |= (1 << N);\nClear bit N: val &= ~(1 << N);\nToggle bit N: val ^= (1 << N);\nCheck bit N: bool isSet = (val >> N) & 1;",
        explanation: "Used for register config. `<<` shifts bits. `|` sets to 1. `&` with `~` sets to 0. `^` flips."
      },
      {
        title: "Pointers & Memory",
        code: "int x = 10; int *ptr = &x;\n*ptr = 20; // changes x to 20\nvoid func(int *p) { *p++; }",
        explanation: "`&` gets address. `*` dereferences (access value). Pass pointers to functions to modify original variables or avoid copying large structs."
      }
    ]
  },
  {
    category: "2. GPIO & Interrupts",
    items: [
      {
        title: "GPIO Config",
        code: "pinMode(pin, INPUT_PULLUP);\ndigitalWrite(pin, HIGH);\nint state = digitalRead(pin);",
        explanation: "`INPUT_PULLUP` uses internal resistor, preventing floating signals. Essential for buttons connecting to GND."
      },
      {
        title: "Interrupt Service Routine",
        code: "volatile bool flag = false;\nvoid IRAM_ATTR isr() { flag = true; }\nattachInterrupt(digitalPinToInterrupt(pin), isr, FALLING);",
        explanation: "`IRAM_ATTR` keeps ISR in fast RAM. ISRs must be short. No `Serial.print`, `delay`, or I2C inside ISR. Use flags to trigger main loop actions."
      },
      {
        title: "Debouncing",
        code: "if ((millis() - lastTime) > debounceDelay) {\n  // Valid button press action\n  lastTime = millis();\n}",
        explanation: "Mechanical contacts bounce. Software debouncing ignores rapid state changes within a small window (e.g., 50-200ms)."
      }
    ]
  },
  {
    category: "3. Sensors & Protocols",
    items: [
      {
        title: "I2C (2-Wire)",
        code: "Wire.begin(SDA, SCL);\nWire.beginTransmission(0x68);\nWire.write(reg); Wire.endTransmission();\nWire.requestFrom(0x68, len);",
        explanation: "Synchronous, addressable. Master drives Clock (SCL). Used for many sensors (BMP280, OLED). `requestFrom` reads bytes from slave."
      },
      {
        title: "Ultrasonic (HC-SR04)",
        code: "digitalWrite(trig, HIGH); delayMicroseconds(10);\ndigitalWrite(trig, LOW);\nlong duration = pulseIn(echo, HIGH);",
        explanation: "Send 10us trigger pulse. `pulseIn` measures time for echo to return. Distance (cm) = duration * 0.034 / 2."
      },
      {
        title: "Analog (ADC) & PWM",
        code: "int val = analogRead(pin); // 0-4095 (12-bit)\nledcSetup(chan, 5000, 8);\nledcAttachPin(pin, chan);\nledcWrite(chan, duty); // 0-255",
        explanation: "ADC reads voltage. ESP32 ADC is non-linear at edges. LEDC is hardware PWM for dimming LEDs or motor control."
      }
    ]
  },
  {
    category: "4. FreeRTOS Multitasking",
    items: [
      {
        title: "Task Creation",
        code: "xTaskCreate(func, \"Name\", 2048, NULL, 1, NULL);\nvoid func(void *p) {\n  while(1) { ...; vTaskDelay(10); }\n}",
        explanation: "Tasks are independent infinite loops. Stack size is in words. Priority 1 is lower than 2. Tasks MUST yield (delay) to prevent WDT reset."
      },
      {
        title: "Queues",
        code: "QueueHandle_t q = xQueueCreate(10, sizeof(int));\nxQueueSend(q, &val, portMAX_DELAY);\nxQueueReceive(q, &buff, portMAX_DELAY);",
        explanation: "Thread-safe data passing. `Send` copies data into queue. `Receive` blocks if empty. Decouples producers (sensors) from consumers (WiFi)."
      },
      {
        title: "Semaphores (Binary)",
        code: "sem = xSemaphoreCreateBinary();\nxSemaphoreGive(sem); // Unlock/Signal\nxSemaphoreTake(sem, portMAX_DELAY); // Lock/Wait",
        explanation: "Synchronization signal. Used to unblock a task from an ISR (`GiveFromISR`) or protect shared resources (Mutex)."
      }
    ]
  },
  {
    category: "5. Wi-Fi & Networking",
    items: [
      {
        title: "Station Mode (STA)",
        code: "WiFi.begin(ssid, pass);\nwhile(WiFi.status() != WL_CONNECTED) delay(100);\nSerial.println(WiFi.localIP());",
        explanation: "Connects to an existing router. IP assigned via DHCP. Check `WiFi.status()` before making requests."
      },
      {
        title: "Access Point (AP)",
        code: "WiFi.softAP(\"ESP32-AP\", \"12345678\");\nIPAddress IP = WiFi.softAPIP();",
        explanation: "ESP32 creates its own network. Clients connect to ESP32. Useful for configuration pages."
      },
      {
        title: "HTTP Client (REST)",
        code: "HTTPClient http; http.begin(url);\nint code = http.GET(); // or http.POST(json)\nif(code > 0) payload = http.getString();\nhttp.end();",
        explanation: "Synchronous. Blocks until response or timeout. Use `WiFiClientSecure` for HTTPS. Check code 200 for success."
      }
    ]
  },
  {
    category: "6. Async Web & MQTT",
    items: [
      {
        title: "Async Web Server",
        code: "server.on(\"/\", HTTP_GET, [](AsyncWebServerRequest *req){\n  req->send(200, \"text/plain\", \"Hi\");\n});\nserver.begin();",
        explanation: "Non-blocking. Uses callbacks. Handles multiple clients concurrently. Ideal for serving dashboards alongside sensor tasks."
      },
      {
        title: "MQTT (PubSub)",
        code: "client.setServer(broker, 1883);\nclient.connect(\"ID\");\nclient.subscribe(\"topic/in\");\nclient.publish(\"topic/out\", \"msg\");",
        explanation: "Lightweight, event-driven. Broker centralizes msgs. Good for unstable networks. Requires `client.loop()` in main loop."
      },
      {
        title: "MQTT QoS",
        code: "QoS 0: At most once\nQoS 1: At least once\nQoS 2: Exactly once",
        explanation: "QoS 0 is fire-and-forget (fastest). QoS 1 ensures delivery (retry). QoS 2 ensures single delivery (slowest overhead)."
      }
    ]
  },
  {
    category: "7. Sleep Modes & Power",
    items: [
      {
        title: "Deep Sleep",
        code: "esp_sleep_enable_timer_wakeup(us);\nesp_deep_sleep_start();",
        explanation: "Max power saving. CPU/RAM off. Only RTC works. Wakes up via reset (setup runs again). Variables in `RTC_DATA_ATTR` retained."
      },
      {
        title: "Light Sleep",
        code: "esp_light_sleep_start();",
        explanation: "CPU paused, RAM retained. Resumes next line of code. Faster wake, higher current than deep sleep. Good for short idles."
      },
      {
        title: "Wakeup Sources",
        code: "esp_sleep_enable_ext0_wakeup(GPIO_NUM_33, 1);\nesp_sleep_get_wakeup_cause();",
        explanation: "Wake from Deep/Light sleep via Timer, Touch, or EXT0/EXT1 (GPIO). EXT0 uses RTC IO."
      }
    ]
  },
  {
    category: "8. Useful Utilities",
    items: [
      {
        title: "Timing & Debug",
        code: "unsigned long now = millis();\nSerial.printf(\"Val: %d\\n\", val);",
        explanation: "`millis()` for non-blocking delays. `printf` for formatted output. Watchdog triggers if task starves > ~5s."
      },
      {
        title: "JSON Handling",
        code: "StaticJsonDocument<200> doc;\ndoc[\"sensor\"] = \"temp\";\ndoc[\"value\"] = 25.5;\nserializeJson(doc, Serial);",
        explanation: "Use ArduinoJson library. Avoid manual string manipulation for JSON to prevent buffer overflows and syntax errors."
      }
    ]
  }
];