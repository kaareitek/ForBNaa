#include <Link.h>
#include <cstdio>

namespace Link {

Link::Link(int bufsize)
{
	buffer = new char[(bufsize*2)];
	
    serialPort=v24OpenPort("/dev/ttyS1",V24_STANDARD);
    if ( serialPort==NULL )
    {
        fputs("error: sorry, open failed!\n",stderr);
        exit(1);
    }

    int rc=v24SetParameters(serialPort,V24_B115200,V24_8BIT,V24_NONE);
    if ( rc!=V24_E_OK )
    {
        fputs("error: setup of the port failed!\n",stderr);
        v24ClosePort(serialPort);
        exit(1);
    }

    rc=v24SetTimeouts(serialPort,5);
    if ( rc!=V24_E_OK )
    {
        fputs("error: setup of the port timeout failed!\n",stderr);
        v24ClosePort(serialPort);
        exit(1);
    }

    rc=v24FlushRxQueue(serialPort);
    if ( rc!= V24_E_OK )
    {
    	fputs("error: flushing receiverqueue\n", stderr);
    	v24ClosePort(serialPort);
    	exit(1);
    }

    rc=v24FlushTxQueue(serialPort);
    if ( rc!= V24_E_OK )
    {
    	fputs("error: flushing transmitterqueue\n", stderr);
    	v24ClosePort(serialPort);
    	exit(1);
    }
}

Link::~Link()
{
	if(serialPort != NULL)
		v24ClosePort(serialPort);
	if(buffer != NULL)
		delete [] buffer;
}

void Link::send(char buf[], short size)
{
	int count = 0;
 	unsigned char a[1] = {'A'};

	int n = v24Write(serialPort, a, 1);

	if(n != 1)
	{
		printf("Kunne ikke skrive til RS232 port");
	}

	for(int i = 0; i < size; i++)
	{
		if(buf[i] == 'A')
		{
			buffer[count] = 'B';
			count++;
			buffer[count] = 'C';
			count++;
		}
		else if(buf[i] == 'B')
		{
			buffer[count] = 'B';
			count++;
			buffer[count] = 'D';
			count++;
		}
		else
		{
			buffer[count] = buf[i];
			count++;
		}
	}

	const unsigned char* temp = reinterpret_cast<const unsigned char *>(buffer);

	n = v24Write(serialPort, temp, count);

	if(n != count)
	{
		printf("Kunne ikke skrive til RS232 port");
	}

	n = v24Write(serialPort, a, 1);

	if(n != count)
	{
		printf("Kunne ikke skrive til RS232 port");
	}
}

short Link::receive(char buf[], short size)
{
	int error;
	int count = 0;
	int returnSize = 0;

	unsigned char temp[size * 2 + 6];

	while(v24Getc(serialPort) != 'A');

	while(1)
	{
		temp[count] = v24Getc(serialPort);

		if(temp[count] == 'A')
		{
			break;
		}
		else
		{
			count++;
		}
	}

	for(int i = 0; i < count; i++)
	{
		if(temp[i] != 'B')
		{
			returnSize++;
		}
	}

	count = 0;

	for(int i = 0; i < returnSize; i++)
	{
		if(temp[count] == 'B' && temp[count + 1] == 'C')
		{
			buf[i] = 'A';
			count += 2;
		}
		else if(temp[count] == 'B' && temp[count + 1] == 'D')
		{
			buf[i] = 'B';
			count += 2;
		}
		else
		{
			buf[i] = temp[count];
			count++;
		}
	}

	return returnSize;
}

}
