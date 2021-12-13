#include "loadhelper.h"
#include <wiringPi.h>

#define BUTTON_PIN 27

LoadHelper::LoadHelper()
{
	pinMode(BUTTON_PIN, INPUT);
	pullUpDnControl(27, PUD_UP);
}

int LoadHelper::isLoaded()
{
	if(!digitalRead(27))
		return 0;
	return 1;
}
