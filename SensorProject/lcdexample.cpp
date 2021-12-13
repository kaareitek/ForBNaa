#include <wiringPi.h>
#include <lcd.h>

int main()
{
	wiringPiSetup();
	int lcd;
	lcd = lcdInit(2, 16, 4, 29, 28, 0, 1, 2, 3, 0, 0, 0, 0);
	lcdPuts(lcd, "This is");
	lcdPosition(lcd, 0, 1);
	lcdPuts(lcd, "a test");
}
