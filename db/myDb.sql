DROP TABLE usr CASCADE;
DROP TABLE parking_lot CASCADE;
DROP TABLE lot_comment CASCADE;
DROP TABLE building CASCADE;
DROP TABLE parking_lot_building_join CASCADE;

CREATE TABLE public.usr (
   usr_id   SERIAL       NOT NULL
,  username VARCHAR(100) NOT NULL UNIQUE
,  password VARCHAR(100) NOT NULL
,  isAdmin  BOOLEAN      NOT NULL DEFAULT FALSE
,  CONSTRAINT pk_usr PRIMARY KEY (usr_id)
);

CREATE TABLE public.parking_lot (
   parking_lot_id SERIAL       NOT NULL
,  description    TEXT
,  conditions     VARCHAR(100)
,  CONSTRAINT pk_parking_lot PRIMARY KEY (parking_lot_id)
);

CREATE TABLE public.lot_comment ( 
   lot_comment_id    SERIAL       NOT NULL
,  lot_comment_info  VARCHAR(500) 
,  rating            INT          NOT NULL
,  usr_id            INT          NOT NULL
,  parking_lot_id    INT          NOT NULL
,  CONSTRAINT pk_lot_comment PRIMARY KEY (lot_comment_id)
,  CONSTRAINT fk_lot_comment_1 FOREIGN KEY (usr_id)
      REFERENCES public.usr(usr_id)
,  CONSTRAINT fk_lot_comment_2 FOREIGN KEY (parking_lot_id)
      REFERENCES public.parking_lot(parking_lot_id)
);

CREATE TABLE public.building (
   building_id    SERIAL       NOT NULL
,  building_cd    VARCHAR(5)   NOT NULL UNIQUE
,  description    VARCHAR(500)
,  CONSTRAINT pk_building PRIMARY KEY (building_id)
);

CREATE TABLE public.parking_lot_building_join (
   parking_lot_building_join_id SERIAL NOT NULL
,  parking_lot_id               INT    NOT NULL
,  building_id                  INT    NOT NULL
,  CONSTRAINT pk_parking_lot_building_join 
      PRIMARY KEY (parking_lot_building_join_id)
,  CONSTRAINT fk_parking_lot_building_join_1 
      FOREIGN KEY (parking_lot_id) REFERENCES
      public.parking_lot(parking_lot_id)
,  CONSTRAINT fk_parking_lot_building_join_2 
      FOREIGN KEY (building_id) REFERENCES
      public.building(building_id)
);

INSERT INTO parking_lot (description, conditions)
   VALUES ('SW Parking Lot', '')
   ,      ('W Parking Lot' , '')
   ,      ('NW Parking Lot', '')
   ,      ('N Parking Lot' , '')
   ,      ('E Parking Lot' , '')
   ,      ('SE Parking Lot', '')
   ,      ('Central Parking Lot', '')
   ,      ('Long-Term Parking Lot', '')
   ,      ('Center Square Parking Lot', '');

INSERT INTO building (building_cd, description)
   VALUES ('BCTR', 'BYU-Idaho Center')
   ,      ('MCK', 'David O. McKay Library') 
   ,      ('SNW', 'Eliza R. Snow Performing Arts Center') 
   ,      ('BEN', 'Ezra Taft Benson Agricultural & Biological Sciences Building')
   ,      ('ROM', 'George S. Romney Building')
   ,      ('HIN', 'Gordon B. Hinckley Building')
   ,      ('MC' , 'Hyrum Manwaring Student Center')
   ,      ('SPO', 'Jacob Spori Building')
   ,      ('CLK', 'John L. Clarke Building')
   ,      ('TAY', 'John Taylor Building')
   ,      ('HRT', 'John W. Hart Physical Education Building')
   ,      ('SMI', 'Joseph Fielding Smith Building')
   ,      ('AUS', 'Mark Austin Technical & Engineering Building')
   ,      ('KRK', 'Oscar A. Kirkham Building')
   ,      ('STC', 'Science & Technology Center')
   ,      ('KIM', 'Spence W. Kimball Student & Administration Services Building')
   ,      ('SHC', 'Student Heath & Counseling Center')
   ,      ('RKS', 'Thomas E. Ricks Building');

   INSERT INTO parking_lot_building_join (parking_lot_id, building_id)
   VALUES (1, 4)
   ,      (1, 13)
   ,      (1, 15)
   ,      (2, 1)
   ,      (2, 7)
   ,      (2, 11)
   ,      (3, 3)
   ,      (3, 5)
   ,      (3, 8)
   ,      (3, 11)
   ,      (4, 3)
   ,      (4, 5)
   ,      (4, 8)
   ,      (4, 9)
   ,      (4, 14)
   ,      (5, 2)
   ,      (5, 6)
   ,      (5, 9)
   ,      (5, 10)
   ,      (5, 12)
   ,      (5, 16)
   ,      (5, 17)
   ,      (6, 6)
   ,      (6, 17)
   ,      (6, 18)
   ,      (7, 1)
   ,      (7, 4)
   ,      (7, 7)
   ,      (7, 10)
   ,      (7, 13)
   ,      (8, 17)
   ,      (9, 18);
