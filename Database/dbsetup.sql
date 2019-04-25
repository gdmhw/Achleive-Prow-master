DROP TABLE Fault;
DROP TABLE Groups;
DROP TABLE Gear;
DROP TABLE Reservation;
DROP TABLE Bike;
DROP TABLE Dock;
DROP TABLE Pass;
DROP TABLE Account;
DROP TABLE Logins;

/*
  Logins
    Contains email (username) and SALTED AND HASHED password.
    Password should never contain a plain text password.
    Please contact DB Administrator for information on hashing algorithm being used
*/
CREATE TABLE Logins (
  email VARCHAR(320) PRIMARY KEY,
  password VARCHAR(255),
  accessToken VARCHAR(255)
)ENGINE=INNODB;

/*
  Account
    Contains details for all users of the Wheelz system.
    Make note of the size allocated to address detials, cardNo should contain
    no whitespace as it is a simple int data type.
    Expiry is 5 char to include the '/'
    cardNo varchar as stored data should be hashed using hasing algorithm
    Membership may eventually be a more descriptive enum.
    Form validation required to ensure DB errors are not encountered.
*/
CREATE TABLE Account (
  userID INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('user', 'operator', 'manager', 'guest'),
  fname VARCHAR(50),
  lname VARCHAR(50),
  email VARCHAR(320),
  dob DATE,
  FOREIGN KEY (email) REFERENCES Logins (email)
)ENGINE=INNODB;

/*
  Pass
    Contains all information about a pass.
    Annual and day passes available.
    Activation and expiry dates contained
    Linked to a specific user
*/
CREATE TABLE Pass (
  passID INT PRIMARY KEY AUTO_INCREMENT,
  userID INT NOT NULL,
  type enum('annual', 'day') NOT NULL,
  activationDate DATETIME NOT NULL,
  expiryDate DATETIME NOT NULL,
  FOREIGN KEY (userID) REFERENCES Account (userID)
)ENGINE=INNODB;

/*
  Dock
    dockName should be a unique string
    locationCoord is set as varchar to support any notation of commas
    capacity should be total capacity of a dock
    have no included reservable total because this will be controlled via the interfaces
    docks can be put into an unusable state with 'active' field
*/
CREATE TABLE Dock (
  dockID INT PRIMARY KEY AUTO_INCREMENT,
  dockName VARCHAR(50) NOT NULL,
  latitude VARCHAR(50) NOT NULL,
  longitude VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  active ENUM('yes', 'no') NOT NULL
)ENGINE=INNODB;

/*
  Bike
    Location is the co-ord of the bike
    dock is which dock the bike is actually docked at (if any)
    location and dock may be the same, but helpful to distinguish
*/
CREATE TABLE Bike (
  bikeID INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('standard', 'mountain', 'road') NOT NULL,
  latitude VARCHAR(50),
  longitude VARCHAR(50),
  dock INT,
  usable ENUM('yes', 'no'),
  FOREIGN KEY (dock) REFERENCES Dock (dockID)
)ENGINE=INNODB;

/*
  Reservation
    Destination is optional
    bikeType here is necessary because bikeIDs are not assigned in advance, only on the day
    This will result in data duplication of type over Reservation and Bike 
    routeTaken should be a link to a csv file of the route
    score is the customer review of a trip
    feedback is set to 1000 characters max, validation required in product
*/
CREATE TABLE Reservation (
  resID INT PRIMARY KEY AUTO_INCREMENT,
  createdTime DATETIME NOT NULL,
  bikeID INT,
  bikeType ENUM('standard', 'mountain', 'road') NOT NULL,
  pickupDock INT,
  userID INT,
  timeFrom DATETIME NOT NULL,
  timeUntil DATETIME,
  destination INT,
  routeTaken VARCHAR(75),
  status ENUM('reserved', 'active', 'cancelled', 'ended') NOT NULL,
  score INT,
  feedback VARCHAR(2000),
  FOREIGN KEY (bikeID) REFERENCES Bike (bikeID),
  FOREIGN KEY (pickupDock) REFERENCES Dock (dockID),
  FOREIGN KEY (userID) REFERENCES Account (userID),
  FOREIGN KEY (destination) REFERENCES Dock (dockID)
)ENGINE=INNODB;

/*
  Gear
    Gear type can be eloborated on easily
    location describes which dock the gear is stored at.
    If decision taken to store gear centrally this field can be removed
    will only have a resID if currently reserved for a future booking
*/
CREATE TABLE Gear (
  gearID INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('pump', 'helmet', 'knee guard', 'elbow pads', 'water bottle') NOT NULL,
  location INT NOT NULL,
  resID INT,
  FOREIGN KEY (location) REFERENCES Dock (dockID),
  FOREIGN KEY (resID) REFERENCES Reservation (resID)
)ENGINE=INNODB;

/*
  Groups
    Groups HAS to be used instead of Group due to keyword status of Group
    Some duplication with userID being the same for many entries.
    Potential of splitting this table into 2
*/
CREATE TABLE Groups (
  groupID INT NOT NULL AUTO_INCREMENT,
  resID INT NOT NULL UNIQUE,
  PRIMARY KEY (groupID, resID),
  FOREIGN KEY (resID) REFERENCES Reservation (resID)
)ENGINE=INNODB;

/*
  Fault
    Usernotes is set at 2000 characters.
    Validation required to ensure no field overflow
*/
CREATE TABLE Fault (
  faultID INT PRIMARY KEY AUTO_INCREMENT,
  bikeID INT NOT NULL,
  completed ENUM('yes', 'no'),
  userNotes VARCHAR(2000),
  FOREIGN KEY (bikeID) REFERENCES Bike (bikeID)
)ENGINE=INNODB;
