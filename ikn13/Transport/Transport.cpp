#include <iostream>
#include <cstring>
#include <cstdio>
#include <Transport.h>
#include <TransConst.h>

#define DEFAULT_SEQNO 2

namespace Transport
{
	Transport::Transport (short BUFSIZE)
	{
		link = new Link::Link(BUFSIZE+ACKSIZE);
		checksum = new Checksum();
		buffer = new char[BUFSIZE+ACKSIZE];
		seqNo = 0;
		old_seqNo = DEFAULT_SEQNO;
		errorCount = 0;
	}
		
	Transport::~Transport()
	{
		if(link) delete link;
		if(checksum) delete checksum;
		if(buffer) delete [] buffer;
	}

	bool Transport::receiveAck()
	{
		char buf[ACKSIZE];
		short size = link->receive(buf, ACKSIZE);
		if (size != ACKSIZE) return false;
		if(!checksum->checkChecksum(buf, ACKSIZE) ||
				buf[SEQNO] != seqNo ||
				buf[TYPE] != ACK)
			return false;
			
		seqNo = (buffer[SEQNO] + 1) % 2;
			
		return true;
	}
		
	void Transport::sendAck (bool ackType)
	{
		char ackBuf[ACKSIZE];
		ackBuf [SEQNO] = (ackType ? buffer[SEQNO] : (buffer[SEQNO] + 1) % 2);
		ackBuf [TYPE] = ACK;
		checksum->calcChecksum (ackBuf, ACKSIZE);

		link->send(ackBuf, ACKSIZE);
	}
		
	void Transport::send(const char buf[], short size)
	{
		while(!receiveAck())
		{
			for(int i = 0; i < size; i++)
			{
				buffer[i + 4] = buf[i];
			}

			buffer[SEQNO] = seqNo;
			buffer[TYPE] = DATA;

			checksum->calcChecksum(buffer, size + 4);

			link->send(buffer, size + 4);
		}
	}
		
	short Transport::receive(char buf[], short size)
	{
		while(1)
		{
			short n;

			n = link->receive(buffer, size);

			while(!checksum->checkChecksum(buffer,n))
			{
				sendAck(false);
				n = link->receive(buffer,size);
				printf("Checksum fejl\n");
				errorCount++;
			}

			sendAck(true);

			if(seqNo == buffer[SEQNO]) 
			{
				seqNo = (buffer[SEQNO] + 1) % 2;

				for(int i = 0; i < n - 4; i++)
				{
					buf[i] = buffer[i + 4];
				}

				return n - 4; 
			}
		}
	}
}


