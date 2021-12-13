#include "sensorhelper.h"
#include <wiringPiI2C.h>
#include <cstdio>
#include <string.h>
#include <errno.h>
#include <stdint.h>

//Block sent to VL53L3CX to initiate a measurement. Courtesy of SparkFun
//Was obtained by manually inspecting operations of an ST NUCLEO board.
char configBlock[137] = { 
	0x00, 0x01, 0x29, 0x02, 0x10, 0x00, 0x28, 0xBC, 0x7A, 0x81, //8 
  	0x80, 0x07, 0x95, 0x00, 0xED, 0xFF, 0xF7, 0xFD, //16 
	0x9E, 0x0E, 0x00, 0x10, 0x01, 0x00, 0x00, 0x00, //24 
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x34, 0x00, //32 
	0x28, 0x00, 0x0D, 0x0A, 0x00, 0x00, 0x00, 0x00, //40 
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x11, //48 
	0x02, 0x00, 0x02, 0x08, 0x00, 0x08, 0x10, 0x01, //56 
	0x01, 0x00, 0x00, 0x00, 0x00, 0xFF, 0x00, 0x02, //64 
	0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x0B, 0x00, //72 
	0x00, 0x02, 0x0A, 0x21, 0x00, 0x00, 0x02, 0x00, //80 
	0x00, 0x00, 0x00, 0xC8, 0x00, 0x00, 0x38, 0xFF, //88 
	0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x91, 0x0F, //96
  	0x00, 0xA5, 0x0D, 0x00, 0x80, 0x00, 0x0C, 0x08, //104 
	0xB8, 0x00, 0x00, 0x00, 0x00, 0x0E, 0x10, 0x00, //112 
	0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x0F, //120 
	0x0D, 0x0E, 0x0E, 0x01, 0x00, 0x02, 0xC7, 0xFF, //128 
	0x8B, 0x00, 0x00, 0x00, 0x01, 0x01, 0x40 //129 - 135 (0x81 - 0x87)
};

//#define VL53LX_IOCTL_START _IO('p', 0x01)

int fd;

bool SensorHelper::initDevice()
{
	fd = wiringPiI2CSetup(0x29);
	printf("%d", fd);
	if(ioctl(fd, I2C_SLAVE, 0x29) < 0)
		printf("i2c error");
	else
		printf("all ok");
	/*while(wiringPiI2CReadReg16(fd, 0x00E5) & 0x01 == 0)
		printf("mojn");
	usleep(1000);*/

	return true;
}

void SensorHelper::startRanging()
{
	//wiringPi I2C does not support sending arbitrary amounts of data, have to use 
	//standard I2C methods
	//wiringPiI2CWrite(fd, configBlock);

	write(fd, configBlock, 137);

	//Though taken directly from the Linux Driver documentation, returns
	//error stating invalid command for device, even when driver is loaded
	/*int rc;
	rc = ioctl(fd, VL53LX_IOCTL_START, NULL);
	if(rc)
		printf("%d %s", rc, strerror(errno));*/
}

int SensorHelper::getDistance()
{
	while(!dataReady())
	{
		usleep(5);
		printf("waiting on data");
	}

	int res = wiringPiI2CReadReg16(fd, 0x0EDE);
	printf("%d", res);

	return res;
}

bool SensorHelper::dataReady()
{
	int res = wiringPiI2CReadReg8(fd, 0x0031);

	if(res != 0x03)
		return true;

	return false;
}

