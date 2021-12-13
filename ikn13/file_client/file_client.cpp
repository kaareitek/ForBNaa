#include <fstream>
#include <string>
#include <sstream>
#include <cstring>
#include <cstdlib>
#include <Transport.h>
#include <lib.h>
#include <file_client.h>

#define BUFSIZE 1000

file_client::file_client(int argc, char **argv)
{
   	Transport::Transport transport(BUFSIZE);

   	printf("Forsøger at modtage fil\n");

   	transport.send(argv[1], strlen(argv[1]));
   	receiveFile(argv[1], &transport);
}

void file_client::receiveFile (std::string fileName, Transport::Transport *transport)
{
   	char buffer[BUFSIZE];
   	memset(buffer, 0, BUFSIZE);
   	long filesize;
   	const char* filename;

   	transport->receive(buffer, BUFSIZE);
   	filesize = atol(buffer);

   	if(filesize <= 0)
   	{
   		error("Fil findes ikke på server\n");
   	}
   	else
   	{
   		filename = extractFileName(fileName).c_str();

   		FILE* fp = fopen(filename, "wb");

   		if(fp == NULL)
   		{
   			error("Fejl i åbning af fil\n");
   		}
   		else
   		{
   			memset(buffer, 0, BUFSIZE);

   			int n;
   			long size = 0;

   			while(size != filesize)
   			{
   				n = transport->receive(buffer, BUFSIZE);
   				fwrite(buffer, 1, n, fp);
   				memset(buffer, 0, BUFSIZE);

   				size += n;
   			}

   			printf("Fil modtaget fra server");
   			fclose(fp);
   		}
   	}
}		

int main(int argc, char** argv)
{
	new file_client(argc, argv);
	
	return 0;
}
