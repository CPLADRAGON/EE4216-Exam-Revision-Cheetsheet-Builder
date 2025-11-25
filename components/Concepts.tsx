import React, { useState } from 'react';
import { ArrowLeft, Search, Book, Code, AlertTriangle, Cpu, Wifi, Zap, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { ViewState } from '../types';

interface ConceptsProps {
  changeView: (view: ViewState) => void;
}

type Category = 'Protocols' | 'RTOS' | 'Hardware' | 'Power';

interface ConceptItem {
  id: string;
  title: string;
  category: Category;
  definition: string;
  keyPoints: string[];
  pitfalls?: string[];
  codeSnippet?: string;
}

const CONCEPTS_DB: ConceptItem[] = [
  // --- PROTOCOLS ---
  {
    id: 'mqtt',
    title: 'MQTT (Message Queuing Telemetry Transport)',
    category: 'Protocols',
    definition: 'A lightweight, publish-subscribe network protocol. Designed for low-bandwidth, high-latency networks. Devices (Clients) exchange messages via a central Broker.',
    keyPoints: [
      'Publish/Subscribe: Decoupled communication.',
      'Topics: Hierarchical strings (e.g., "home/livingroom/temp").',
      'QoS 0: At most once (Fire & Forget).',
      'QoS 1: At least once (Guaranteed delivery, duplicates possible).',
      'QoS 2: Exactly once (Guaranteed, no duplicates).',
      'Keep-Alive: Client must ping broker periodically to stay connected.'
    ],
    pitfalls: [
      'Blocking Loop: `client.loop()` must run frequently. Do not use `delay()` in the main loop.',
      'Topic Formats: Topics are case-sensitive.'
    ],
    codeSnippet: `// In loop()
if (!client.connected()) reconnect();
client.loop(); // ESSENTIAL

// Publishing
client.publish("sensors/temp", "25.5");

// Subscribing
client.subscribe("controls/light");`
  },
  {
    id: 'http',
    title: 'HTTP (Hypertext Transfer Protocol)',
    category: 'Protocols',
    definition: 'A request-response protocol. The ESP32 (Client) requests data from a Server (GET) or sends data to it (POST).',
    keyPoints: [
      'Stateless: Each connection is new; no memory of previous requests.',
      'Methods: GET (Read), POST (Create), PUT (Update), DELETE.',
      'Headers: Metadata (e.g., `Content-Type: application/json`).',
      'Response Codes: 200 (OK), 404 (Not Found), 500 (Server Error).'
    ],
    codeSnippet: `HTTPClient http;
http.begin("http://api.site.com/data");
int code = http.GET();

if (code == 200) {
  String payload = http.getString();
}
http.end(); // Free resources`
  },
  // --- RTOS ---
  {
    id: 'tasks',
    title: 'FreeRTOS Tasks',
    category: 'RTOS',
    definition: 'Independent threads of execution. The scheduler switches between them to create multitasking.',
    keyPoints: [
      'Infinite Loop: Tasks usually run forever `while(1)`.',
      'Priorities: Higher number = Higher priority.',
      'Stack Size: Defined in words (not bytes).',
      'Core Pinning: Can run on Core 0 or Core 1.'
    ],
    pitfalls: [
      'Watchdog Reset: High priority tasks MUST yield (using `vTaskDelay`) or the Watchdog Timer (WDT) will reset the ESP32.'
    ],
    codeSnippet: `void myTask(void *p) {
  while(1) {
    // Do work
    vTaskDelay(100 / portTICK_PERIOD_MS); // Yield
  }
}

xTaskCreate(myTask, "Name", 2048, NULL, 1, NULL);`
  },
  {
    id: 'queues',
    title: 'FreeRTOS Queues',
    category: 'RTOS',
    definition: 'A FIFO (First-In, First-Out) buffer to safely send data between tasks.',
    keyPoints: [
      'Thread Safe: Handles concurrency automatically.',
      'Copy by Value: Data is copied into the queue, not just referenced.',
      'Blocking: `xQueueReceive` waits if empty; `xQueueSend` waits if full.'
    ],
    codeSnippet: `QueueHandle_t q = xQueueCreate(10, sizeof(int));

// Task A (Send)
int val = 100;
xQueueSend(q, &val, portMAX_DELAY);

// Task B (Receive)
int rx;
if (xQueueReceive(q, &rx, portMAX_DELAY)) {
  // Process rx
}`
  },
  {
    id: 'semaphores',
    title: 'Semaphores & Mutexes',
    category: 'RTOS',
    definition: 'Synchronization tools. Semaphores signal events; Mutexes protect shared resources.',
    keyPoints: [
      'Binary Semaphore: Flag (0 or 1). "Give" to signal, "Take" to wait.',
      'Mutex: Like a token. Only one task can hold it at a time. Prevents race conditions on global variables.',
      'ISR: Use `FromISR` versions inside interrupts.'
    ],
    codeSnippet: `SemaphoreHandle_t mutex = xSemaphoreCreateMutex();

// Access shared resource
if (xSemaphoreTake(mutex, portMAX_DELAY)) {
  // Critical section
  globalVar++;
  xSemaphoreGive(mutex);
}`
  },
  // --- HARDWARE ---
  {
    id: 'dht',
    title: 'DHT11 / DHT22 Sensors',
    category: 'Hardware',
    definition: 'Digital temperature and humidity sensors using a proprietary single-wire protocol.',
    keyPoints: [
      'Wiring: VCC (3.3V/5V), GND, Data. Data pin needs a 10k Pull-Up resistor.',
      'Timing: DHT11 (1Hz sampling), DHT22 (0.5Hz sampling).',
      'Accuracy: DHT22 is more accurate than DHT11.'
    ],
    pitfalls: [
      'Reading too fast returns old data or errors.',
      'Always check `isnan()` on results.'
    ],
    codeSnippet: `#include "DHT.h"
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() { dht.begin(); }
void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) Serial.println("Fail");
  delay(2000);
}`
  },
  {
    id: 'neopixel',
    title: 'NeoPixel (WS2812B) RGB LEDs',
    category: 'Hardware',
    definition: 'Addressable RGB LEDs where each pixel is controlled individually via a single data line.',
    keyPoints: [
      'Daisy Chain: DOUT of one connects to DIN of next.',
      'Power: 5V required. High current draw (up to 60mA per pixel white).',
      'Logic: 5V logic preferred, but ESP32 3.3V usually works.',
      'Update: Changes are not visible until `strip.show()` is called.'
    ],
    codeSnippet: `#include <Adafruit_NeoPixel.h>
#define PIN 5
#define NUM 8
Adafruit_NeoPixel strip(NUM, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.setBrightness(50);
}
void loop() {
  strip.setPixelColor(0, strip.Color(255, 0, 0)); // Red
  strip.show(); 
}`
  },
  {
    id: 'soil',
    title: 'Capacitive Soil Moisture',
    category: 'Hardware',
    definition: 'Measures soil moisture content based on capacitance changes. Analog output.',
    keyPoints: [
      'Capacitive vs Resistive: Capacitive resists corrosion better.',
      'Output: Analog voltage. High value = Dry, Low value = Wet (Inverse logic usually).',
      'Calibration: Measure "Air" value (0%) and "Water" value (100%) to map.'
    ],
    codeSnippet: `const int AIR_VAL = 3500; // Measure this
const int WATER_VAL = 1500; // Measure this

void loop() {
  int raw = analogRead(34);
  int percent = map(raw, AIR_VAL, WATER_VAL, 0, 100);
  percent = constrain(percent, 0, 100);
  Serial.printf("Moisture: %d%%\\n", percent);
}`
  },
  {
    id: 'isr',
    title: 'GPIO Interrupts',
    category: 'Hardware',
    definition: 'Trigger code execution immediately on pin state change (Rising/Falling edge).',
    keyPoints: [
      'IRAM_ATTR: Stores ISR in RAM for speed.',
      'Keep it Short: Set a flag and exit. No Serial prints or delays inside.',
      'Debounce: Mechanical switches generate multiple triggers; software debounce needed.'
    ],
    codeSnippet: `volatile bool pressed = false;
void IRAM_ATTR isr() {
  pressed = true;
}
void setup() {
  pinMode(0, INPUT_PULLUP);
  attachInterrupt(0, isr, FALLING);
}`
  },
  // --- POWER ---
  {
    id: 'deep_sleep',
    title: 'Deep Sleep',
    category: 'Power',
    definition: 'Lowest power mode. CPU/RAM off. Only RTC active. Wakes via Reset.',
    keyPoints: [
      'Power: ~10uA current.',
      'Memory: SRAM lost. Use `RTC_DATA_ATTR` variables to save state.',
      'Wakeup: Timer, Touch, Ext0 (RTC GPIO), Ext1.'
    ],
    codeSnippet: `RTC_DATA_ATTR int bootCount = 0;
void setup() {
  bootCount++;
  // Sleep for 5s
  esp_sleep_enable_timer_wakeup(5 * 1000000);
  esp_deep_sleep_start();
}`
  }
];

const Concepts: React.FC<ConceptsProps> = ({ changeView }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredConcepts = CONCEPTS_DB.filter(concept => {
    const matchesCategory = activeCategory === 'All' || concept.category === activeCategory;
    const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          concept.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (cat: Category) => {
    switch(cat) {
      case 'Protocols': return <Wifi className="w-4 h-4" />;
      case 'RTOS': return <Layers className="w-4 h-4" />;
      case 'Hardware': return <Cpu className="w-4 h-4" />;
      case 'Power': return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => changeView(ViewState.DASHBOARD)}
            className="flex items-center text-slate-600 hover:text-nus-blue font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="font-bold text-lg text-slate-800 hidden sm:block">Key Concepts Study Guide</h1>
          <div className="w-8"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search concepts (e.g., 'mutex', 'dht')..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-nus-blue focus:border-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Protocols', 'RTOS', 'Hardware', 'Power'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-nus-blue text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-4">
          {filteredConcepts.length > 0 ? (
            filteredConcepts.map((concept) => (
              <div key={concept.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200">
                <div 
                  onClick={() => toggleExpand(concept.id)}
                  className="p-5 cursor-pointer hover:bg-slate-50 flex items-start justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg mt-1 ${
                      concept.category === 'Protocols' ? 'bg-purple-100 text-purple-700' :
                      concept.category === 'RTOS' ? 'bg-green-100 text-green-700' :
                      concept.category === 'Hardware' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {getCategoryIcon(concept.category)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{concept.title}</h3>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">{concept.definition}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 mt-1">
                    {expandedItems.includes(concept.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {expandedItems.includes(concept.id) && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-6 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Key Points */}
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Book className="w-4 h-4" /> Key Characteristics
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-1">
                        {concept.keyPoints.map((point, idx) => (
                          <li key={idx}><span dangerouslySetInnerHTML={{ __html: point.replace(/:/g, ':<span class="font-semibold text-slate-900">').replace(/\./g, '.</span>') }} /></li>
                        ))}
                      </ul>
                    </div>

                    {/* Pitfalls */}
                    {concept.pitfalls && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4" /> Common Pitfalls & Errors
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 ml-1">
                          {concept.pitfalls.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Code Snippet */}
                    {concept.codeSnippet && (
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                          <Code className="w-4 h-4" /> Example Code
                        </div>
                        <div className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
                          <pre className="font-mono text-xs leading-relaxed text-blue-100">
                            {concept.codeSnippet}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg">No concepts found matching "{searchQuery}"</div>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-nus-blue font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Concepts;