#ifndef SENSORHELPER_H
#define SENSORHELPER_H
#endif

#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/i2c-dev.h>
#include <fcntl.h>

class SensorHelper
{
	public:
		bool initDevice();
		void startRanging();
		bool dataReady();
		int getDistance();
		int getWeigth();

};
