#include <wiringPi.h>
#include <lcd.h>
#include <cups/cups.h>
#include <cstdio>
#include <curl/curl.h>
#include "sensorhelper.h"
#include "VL53L1X.h"
#include <unistd.h>
#include <iostream>
#include <fstream>

#define BUTTON_PIN 27

using namespace std;


VL53L1X Distance_Sensor;

int main()
{
	wiringPiSetup();
	
	//Doesn't work
	/*SensorHelper s;
	s.initDevice();	
	s.startRanging();	
	s.getDistance();*/

	//curl = curl_easy_init();

	pinMode(BUTTON_PIN, INPUT);
	pullUpDnControl(27, PUD_UP);

	int lcd;
        lcd = lcdInit(2, 16, 4, 29, 28, 0, 1, 2, 3, 0, 0, 0, 0);
	lcdClear(lcd);

	Distance_Sensor.begin();

	Distance_Sensor.startMeasurement();

	ofstream f;

	string temp;

	int distancemm;

	while(1)
	{

		while(Distance_Sensor.newDataReady() == false)
			usleep(5);

		distancemm = Distance_Sensor.getDistance();

		if(distancemm <= 100)
		{
			f.open("test.txt");
			f << distancemm;
			f.close();
		
			temp = to_string(distancemm);

			lcdPuts(lcd, temp.c_str());

			while(digitalRead(27));

			cupsPrintFile("Zebra_Technologies_ZTC_GK420d", "test.txt", "test", 0, NULL);
		} 
	}
}

