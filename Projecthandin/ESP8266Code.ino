#include <TinyGPS++.h>
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <FS.h>
#include <DHT.h>
#include <sys/time.h>
#include <PubSubClient.h>

#define DHTPIN 14
#define DHTTYPE DHT22

#define mqtt_server "test.mosquitto.org"

extern "C" {
#include "user_interface.h"
}

WiFiClient espClient;
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE);
const char* ssid = "ASUS_2.4";
const char* password = "lmnlmnlmn1";
char* returnString;
char coord[50];
char temperature[10];
int timeCounter;
File logFile;
File sessionFile;

struct tm now;
struct tm then;

float temp;

TinyGPSPlus gps;

SoftwareSerial ss(4, 5);

void setup() {
  //pinMode(10, INPUT);
  pinMode(14, INPUT_PULLUP);
  pinMode(4, INPUT);
  pinMode(5, OUTPUT);
  Serial.begin(9600);  
  ss.begin(9600);
  dht.begin();

  smartDelay(10000);

  SPIFFS.begin();

  if (!SPIFFS.exists("/logFile.txt"))
  {
    logFile = SPIFFS.open("/logFile.txt", "w");
    logFile.println("1");
    logFile.println(getLocation());
    logFile.close();
  }

  logFile = SPIFFS.open("/logFile.txt", "r");

  //ugly hack solution
  logFile.readStringUntil('\n');
  String line = logFile.readStringUntil(',');
  String line2 = logFile.readStringUntil('\n');
  double oldLat = atof(line.c_str());
  double oldLong = atof(line2.c_str());

  logFile.close();

  int distance;

  double currLat = gps.location.lat();
  double currLong = gps.location.lng();

  Serial.printf("%.6f\n", currLat);
  Serial.printf("%.6f\n", currLong);
  
  distance = gps.distanceBetween(gps.location.lat(), gps.location.lng(), oldLat, oldLong);

  //if(1) //test
  if(distance > 50)
  {
    Serial.printf("%d meters from start\n", distance);
    Serial.println("Distance above 50 meters, active session");
    
    sessionFile = SPIFFS.open("/sessionFile.txt", "a");
    
    Serial.println("Saving gps data");
    sessionFile.print("g");
    sessionFile.print(getTime());
    sessionFile.print("_");
    
    sessionFile.print(getLocation());
    sessionFile.print('\n');
    sessionFile.close();

    File test = SPIFFS.open("/sessionFile.txt", "r");
    Serial.println(test.readStringUntil('\n'));
    test.close();

    //has 5 minutes elapsed?
    strptime(getTime().c_str(), "%d/%m/%Y %H:%M:%S", &now);

    //even more ugly and hacky solution incoming
    sessionFile = SPIFFS.open("/sessionFile.txt", "r");

    String tempLine;
    String tempTime = " ";
    String nextLine = " ";

    while(nextLine != '\0')
    {
      sessionFile.readStringUntil('t');
      tempLine = sessionFile.readStringUntil(',');
      if(tempLine.charAt(2) == '/')
          tempTime = tempLine;
      Serial.println(tempTime);
      nextLine = sessionFile.readStringUntil('\n');
      Serial.println(nextLine);
    }

    strptime(tempTime.c_str(), "%d/%m/%Y %H:%M:%S", &then);
    
    sessionFile.close();

    double diff = difftime(mktime(&now), mktime(&then));
      //yes
      if(diff >= 300)
      {
        //save temperature data
        sessionFile = SPIFFS.open("/sessionFile.txt", "a");

        sessionFile.print("t");
        sessionFile.print(getTime());
        sessionFile.print(", ");

        temp = dht.readTemperature();

        sprintf(temperature, "%f", temp);

        sessionFile.print(temperature);  
        sessionFile.print('\n');

        sessionFile.close();

        File test2 = SPIFFS.open("/sessionFile.txt", "r");
        String test3 = test2.readStringUntil('t');

        Serial.println(test2.readStringUntil('\n'));
        
        test.close();
      }
      //no
      else
        ESP.deepSleep(15000);
  }
  else
  {
    Serial.printf("%d meters from start\n", distance);
    Serial.println("Distance below 50 meters, do we need to send data?");

    //yes
      if(checkAndConnect())
        sendMQTTData();
    //no
      else
        ESP.deepSleep(15000);
  }

  ESP.deepSleep(15000);
}

void loop()
{
  
}

static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do
  {
    while (ss.available())
      gps.encode(ss.read());
  } 
  while (millis() - start < ms);
      gps.encode(ss.read());    
}

String getTime()
{
  String ret;
  
  ret += gps.date.day();
  ret += '/';
  ret += gps.date.month();
  ret += "/";
  ret += gps.date.year();
  ret += "-";
  
  ret += gps.time.hour();
  ret += (":");
  ret += gps.time.minute();
  ret += (":");
  ret += gps.time.second();

  return ret;
}

const char* getLocation()
{
  //gather the location and return it

  double oldlatitude = gps.location.lat();
  double oldlongitude = gps.location.lng();

  smartDelay(1000);

  double latitude = gps.location.lat();
  double longitude = gps.location.lng();

  Serial.println(gps.distanceBetween(oldlatitude, oldlongitude, latitude, longitude));

  sprintf(coord, "%f,%f", latitude, longitude);

  Serial.println(coord);

  return coord;
}

void sendMQTTData()
{
  ss.end();
  
  client.setServer(mqtt_server, 1883);

  while(!client.connected())
  {
    if (client.connect("ESP8266Client"))
      Serial.println("connected");
    else
    {
      Serial.println("couldn't connect, going to sleep and trying again later");
      ESP.deepSleep(15000);
    }
  }

  int sessionNumber;
  String homeLocation;
  
  logFile = SPIFFS.open("/logFile.txt", "r");
  sessionNumber = logFile.readStringUntil('\n').toInt();
  homeLocation = logFile.readStringUntil('\n');
  logFile.close();

  String line = "";
  String topic;
  String mac = WiFi.macAddress();

  sessionFile = SPIFFS.open("/sessionFile.txt", "r");

  while(sessionFile.available() && client.connected())
  {
    client.loop();

    topic = "datagremlins/";
    topic += mac;
    topic += '/';

    line = String(sessionNumber);
    line += '_';
    line += sessionFile.readStringUntil('\n');

    Serial.println(line);

    if(line.charAt(2) == 't')
      topic += "temperature";
    else
      topic += "position";

    Serial.println(client.publish(topic.c_str(), line.c_str()));

    delay(20);
  }

  sessionFile.close();
  
  logFile = SPIFFS.open("/logFile.txt", "w");
  sessionNumber++;
  logFile.print(sessionNumber);
  logFile.print('\n');
  logFile.print(homeLocation);
  logFile.print('\n');

  logFile.close();

  Serial.println("hallo");
 
  client.disconnect(); 
  // delay(10);
  // wait until connection is closed completely
  while( client.state() != -1){  
    delay(10);
  }

  espClient.flush();
  
  delay(5000);

  ESP.deepSleep(15000);

  //clearFile = SPIFFS.open("/sessionFile.txt", "w");
  //clearFile.close();
}

//bool checkTimeElapsed()
//{
//  
//}

//TODO: fejlhåndtering
bool checkAndConnect()
{
  int numberOfNetworks = WiFi.scanNetworks();

  for (int i = 0; i < numberOfNetworks; i++)
  {
    if (WiFi.SSID(i) == ssid)
    {
      WiFi.begin(ssid, password);

      while (WiFi.status() != WL_CONNECTED)
      {
        delay(1000);
      }

      sessionFile = SPIFFS.open("/sessionFile.txt", "r");

      if(sessionFile.size())
        return true;
      else
        return false;
    }
  }

  return false;
}
