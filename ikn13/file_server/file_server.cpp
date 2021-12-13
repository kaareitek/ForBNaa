#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <cstring>
#include <Transport.h>
#include <lib.h>
#include <file_server.h>

#define BUFSIZE 1000

file_server::file_server ()
{
	Transport::Transport transport(BUFSIZE);
	char buffer[BUFSIZE];

	memset(buffer, 0, BUFSIZE);

	printf("Venter på filnavn");

	transport.receive(buffer, BUFSIZE);

	std::string filename = std::string(buffer);
	filename = extractFileName(filename);

	long filesize = check_File_Exists(filename);
	if(filesize <= 0)
	{
		printf("Fil eksisterer ikke");
	}

	memset(buffer, 0, BUFSIZE);
	sprintf(buffer, "%ld", filesize);

	printf("Sender fil");

	transport.send(buffer, strlen(buffer));

	sendFile(filename, filesize, &transport);

	printf("Fil sendt");
}

void file_server::sendFile(std::string fileName, long fileSize, Transport::Transport *transport)
{
	const char* fileToSend = fileName.c_str();
	char buffer[BUFSIZE];
	int n;
	FILE* fp = fopen(fileToSend, "rb");

	if(fp == NULL)
	{
		error("Fejl i åbning af fil");
	}

	memset(buffer, 0, BUFSIZE);

	while((n = fread(buffer, 1, BUFSIZE, fp)) > 0)
	{
		transport->send(buffer, n);

		memset(buffer, 0, BUFSIZE);
	}

	fclose(fp);
}

int main(int argc, char **argv)
{
	new file_server();
	
	return 0;
}
