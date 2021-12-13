/*Tables should probably also hold metadata: Time of creation, product type, description etc. These are just the most basic elements*/

DROP TABLE IF EXISTS Transactions CASCADE;
DROP TABLE IF EXISTS Apps CASCADE;
DROP TABLE IF EXISTS Developers CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;

CREATE TABLE Customers (
    ID int GENERATED ALWAYS AS IDENTITY,
    Username varchar(100) NOT NULL,
    Password varchar(100) NOT NULL,
    Email varchar(100) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Developers (
    ID int GENERATED ALWAYS AS IDENTITY,
    Username varchar(100) NOT NULL,
    Password varchar(100) NOT NULL,
    Email varchar(100) NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE Apps (
    ID int GENERATED ALWAYS AS IDENTITY,
    DeveloperID int NOT NULL,
    AppName varchar(100) NOT NULL UNIQUE,
    Logo varchar,
    Price int,
    AppURL varchar(100) NOT NULL,
    PRIMARY KEY (ID),
    CONSTRAINT fk_dev
        FOREIGN KEY(DeveloperID)
            REFERENCES Developers(ID) ON DELETE CASCADE
);

CREATE TABLE AppOptions (
    AppID int,
    Options varchar,
    PRIMARY KEY (AppID),
    CONSTRAINT fk_app
        FOREIGN KEY(AppID)
            REFERENCES Apps(ID) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    ID int GENERATED ALWAYS AS IDENTITY,
    AppID int,
    AppName varchar(100) NOT NULL,
    CustomerID int,
    TimeOfPurchase timestamp,
    PRIMARY KEY (ID),
    CONSTRAINT fk_app
        FOREIGN KEY(AppID)
            REFERENCES Apps(ID) ON DELETE CASCADE,
    CONSTRAINT fk_cust
        FOREIGN KEY(CustomerID)
            REFERENCES Customers(ID) ON DELETE CASCADE      
);

INSERT INTO Customers (
    Username,
    Password,
    Email
)
VALUES 
    (
        'barbora',
        'goodpw123',
        'bar@bora.dk'
    ),
    (
        'kåre',
        'betterpw123',
        'kå@re.cz'
    );

INSERT INTO Developers (
    Username,
    Password,
    Email
)
VALUES 
    (
        'barboradev',
        'goodpw123dev',
        'bardev@bora.dk'
    ),
    (
        'kåredev',
        'betterpw123dev',
        'kådev@re.cz'
    );

INSERT INTO Apps (
    DeveloperID,
    AppName,
    Logo,
    Price,
    AppURL
)
VALUES 
    (
        1,
        'barborapp',
        '/bar/bora',
        100000,
        '127.0.0.1:3000'
    ),
    (
        2,
        'kappre',
        '/kå/re',
        0,
        'www.google.com'
    );

INSERT INTO AppOptions (
    AppID,
    Options
)
VALUES
    (
        1,
        '<button id="option-element0" value="toggle">Toggle Button!!!</button>'
    );
/*Should add on deletes to fk*/