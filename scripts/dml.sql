SET search_path TO project;

INSERT INTO USERS (user_id, full_name, email, password, username, profile_photo) VALUES 
(1, 'Dimitar Arsov', 'dimitararsov04@gmail.com', '$2a$10$Vl6VE03lIQmGL/dW2/Ly9emzc7upycbosyjBKjIY93TbN5b1rB1Ry', 'dimitar_arsov2', null),
(2, 'Filip Gavrilovski', 'filipgavrilovski28@gmail.com','$2a$10$oxZZfDwH9ixVdLjnaopmJufBqQpcgPp9e/Bv8aN1Kp/r.EyLIfyoi', 'filip_gavrilovski1', null),
(3, 'Marko Markovski', 'foo@bar.com', '$2a$10$V4ZA8Ka/iBbAM2EWBvJrwu063oqQqACafkQo9tN5Pc1RVJCJpGMH2', 'marko_markovski4', null),
(4, 'Admin Adminovski', 'admin@gmail.com','$2a$10$f5eGW5DuTB82ldmke2/64uY8LSmim.2s7k3HgTRy8CNrhtbz/pEDG', 'admin', null),
(5, 'John Doe', 'john@doe.com','$2a$10$VJg6/xNL1yQa1LNxY3SEp.0XOnbLEbT49fzsbfFk7jjfUUaQmsWpO', 'john_doe4', null),
(6, 'Jane Doe', 'jane@doe.com','$2a$10$hxet6V8ByjTp1x4PINeCAu6rgSUqVsH7DnLHIl95ZH7UHtt5LwqGq', 'jane_doe7', null),
(7, 'Strajk', 'str2@gmail.com','$2a$10$V/AmUSd4BsNxdIEcRrbRwOwGTBAowVebd.0WFs.tFRJ3iibT8lkVy', 'strajk5', null),
(8, 'Kanye West', 'kanyewest@gmail.com', '$2a$10$LEY96RM.EwMf5v1b71MYy.abZLZOp4qRxQvN5ai8u5df.es3rpL3G', 'kanye_west0', null),
(9, 'The Weeknd','weekend@yahoo.com', '$2a$10$DCKcZzfU0BN56cNPSVB8o.v6vyVNMxqXhF68c1MOr7uFY7JztWD1S', 'the_weeknd7', null),
(10, 'Bruno Mars','brunomars@gmail.com', '$2a$10$lAPmxkmcK3gslPnC5FqKa.y55jShUa8n7FWgl04T1BqcsDnz.meRa', 'bruno_mars8', null),
(11, 'Rihanna','rihanna@gmail.com', '$2a$10$c8uq89om6kdFbu1OCIZeveohCrZSd/NIuQc2LnYBd6cwifbmVrI92', 'rihanna_x1', null),
(12, 'Verica Ristevska','vericaristevska@hotmail.com', '$2a$10$n3WJVg0ZUv6ikWc4HYvTNehTKTO2QMzk3FT7/fxZ3PKTFvAyE84Gm', 'verica_ristevska6', null),
(13, 'LD Pistolero','ld@gmail.com', '$2a$10$EFAB9K.HseHZEepT0SHfR.N5B7Y.V5GOJzcChyQ54mqB9Fv64P7Ae', 'ld_pistolero1', null),
(14, 'Andrej Ristikj','aristikj@gmail.com', '$2a$10$4TCCv4ZGTpuuveydB5bZ2evlwsNQul9PqQe0zZIT6pblpLSxirRJC', 'andrej_ristikj1', null),
(15, 'Petar Mitrevski','pmfitness@gmail.com' ,'$2a$10$DKDhmeCKJ99aDjs05uiXvuJp8Nt0o4/m4Bj783Aid6IcOSAUl38S.', 'petar_mitrevski1', null),
(16, 'Stefan Filipovski','steffilipovski@gmail.com', '$2a$10$uR4bOEMyrLzMXm067qI.8uwbkDcojxWkt7TqkJo8iv.X4nExtKZ7C', 'stefan_filipovski6', null),
(17, 'Ema Arsova','arsovaema@yahoo.com', '$2a$10$HcNcruV3RzGGPs5r/XSM0uWiu9nDVFMkXY/FKMtTH2WOY1DmHUWou', 'ema_arsova0', null);

INSERT INTO NON_ADMIN_USERS(user_id) VALUES 
(1),(2),(3),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17);

INSERT INTO ADMINS(user_id) VALUES (4);

INSERT INTO LISTENERS(user_id) VALUES
(1),(2),(3),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15),(16),(17);

INSERT INTO ARTISTS(user_id) VALUES
(7),(8),(9),(10),(11),(12),(13);

INSERT INTO MUSICAL_ENTITIES (id, title, genre, release_date, released_by)
VALUES
(1, 'Stronger', 'Hip Hop', '2007-07-31', 8),
(2, 'Heartless', 'Hip Hop', '2008-11-04',8),
(3, 'Runaway', 'Hip Hop', '2010-10-04', 8),
(4, 'Graduation', 'Hip Hop', '2007-09-11', 8),
(5, 'My Beautiful Dark Twisted Fantasy', 'Hip Hop', '2010-11-22', 8),
(6, 'Blinding Lights', 'R&B', '2019-11-29', 9),
(7, 'Starboy', 'R&B', '2016-09-22', 9),
(8, 'The Hills', 'R&B', '2015-05-27', 9),
(9, 'After Hours', 'R&B', '2020-03-20', 9),
(10, 'Dawn FM', 'R&B', '2022-01-07', 9),
(11, 'Strit Poetiks', 'Rap', '2015-02-12', 7),
(12, 'Ushte Ednash', 'Rap', '2019-05-17', 7),
(13, 'Muzej 2', 'Rap', '2025-12-13', 7),
(14, 'Niz Mojot Zhivot', 'Rap', '2019-10-31', 7),
(15, 'Kutija', 'Rap', '2011-07-26', 7),
(16, 'Ti si pesna shto kje trae', 'Pop', '1978-01-01', 12),
(17, 'Galebe moj tazhen', 'Pop', '1978-01-01', 12),
(18, 'Just the Way You Are', 'Pop', '2010-07-20', 10),
(19, 'Grenade', 'Pop', '2010-09-28', 10),
(20, '24K Magic', 'Pop', '2016-11-18', 10),
(21, '24K Magic', 'Pop', '2016-11-18', 10);


INSERT INTO ALBUMS (id) VALUES
(4),(5),(9),(10),(14),(15),(20);


INSERT INTO SONGS (id, album_id, link)
VALUES
(1, 4, 'https://www.youtube.com/watch?v=PsO6ZnUZI0g'),
(2, 5, 'https://www.youtube.com/watch?v=Co0tTeuUVhU'),
(3, 5, 'https://www.youtube.com/watch?v=Bm5iA4Zupek'),
(6, 9, 'https://www.youtube.com/watch?v=4NRXx6U8ABQ'),
(7, 9, 'https://www.youtube.com/watch?v=34Na4j8AVgA'),
(8, 9, 'https://www.youtube.com/watch?v=yzTuBuRdAyA'),
(11, NULL, 'https://www.youtube.com/watch?v=EOknxkb12lw'),
(12, 14, 'https://www.youtube.com/watch?v=nXQbVZ4_9tQ'),
(13, NULL, 'https://www.youtube.com/watch?v=zrB9H1TZsCU'),
(16, NULL, 'https://www.youtube.com/watch?v=DNWtp6lpLRo'),
(17, NULL, 'https://www.youtube.com/watch?v=QGOAhymaa3o'),
(18, 20, 'https://www.youtube.com/watch?v=LjhCEhWiKXk'),
(19, 20, 'https://www.youtube.com/watch?v=SR6iYWJxHqs'),
(21, 20, 'https://www.youtube.com/watch?v=UqyT8IEBkvY');


INSERT INTO EVENTS
(event_id, name, location, venue, date, time, creator_id) VALUES
(1, 'HipHop - Revolution','Skopje, Macedonia', 'SC Boris Trajkovski', '2026-02-02','21:00:00', 4),
(2,'Event1!', 'Skopje, Macedonia', 'SC Jane Sandanski', '2026-01-30','19:00:00', 4),
(3, 'Fiesta','Barcelona, Spain', 'Stadium Camp Nou', '2026-06-06','22:00:00', 4),
(4, 'NYC-BreakDance','New York City, NY, United States', 'Madison Square Garden','2026-03-03','17:00:00', 4);


INSERT INTO PLAYLISTS (playlist_id, cover, name, created_by) VALUES 
(1, null, 'dimis-playlist', 1),
(2, null, 'za vo kola', 15),
(3, null, 'playlist1', 2);


INSERT INTO FOLLOWS (follower, followee) VALUES
(1,2), (2,1), (2,8), (1,7), (15,7), (1,17), (3,1), (17,1), (16,1), (1,14), (2,14);

INSERT INTO PERFORMS_AT (event_id, artist_id) VALUES
(1,8), (2,13), (2,7), (3,9), (4,10);

INSERT INTO LIKES (listener_id, musical_entity_id) VALUES 
(1, 13), (1, 14), (1,7), (2, 4), (15, 16), (15,17), (14, 15), (15, 12), (15,11); 

INSERT INTO LISTENS (listener_id, song_id, timestamp) VALUES
(2, 12,'2026-02-19 16:23:54+02'),
(1, 13,'2025-12-19 11:13:54+02'),
(13, 12,'2025-11-09 15:23:54+02'),
(14, 13,'2025-01-16 23:23:54+02'),
(2, 12,'2025-10-23 10:23:54+02'),
(15, 16,'2025-11-23 19:23:54+02'),
(9, 16,'2025-11-27 13:28:54+02'),
(13, 19,'2025-11-30 10:10:54+02'),
(7, 21,'2025-12-06 21:23:54+02'),
(14, 23,'2025-12-09 23:23:54+02'),
(15, 13,'2025-12-30 21:23:54+02'),
(16, 17,'2025-12-28 19:23:54+02'),
(10, 17,'2026-01-20 10:40:54+02'),
(13, 12,'2026-01-01 10:21:54+02'),
(7, 18,'2026-01-02 10:26:54+02'),
(8, 16,'2026-01-05 18:23:54+02'),
(8, 17,'2026-01-13 10:23:56+02'),
(8, 18,'2026-01-05 11:23:54+02'),
(2, 18,'2025-12-18 10:34:54+02'),
(2, 12,'2026-02-19 16:23:54+02'),
(1, 13,'2025-12-19 11:13:54+02');


INSERT INTO REVIEWS (listener_id, musical_entity_id, grade, comment) VALUES
(1, 13, 5, 'Najdobra pesna sto postoi!!! Strajk is back!!!!'),
(2, 1, 5, 'i love the old kanye, bring him back...'),
(2, 6, 3, null),
(15, 16, 5, 'ne se pravi veke vakva muzika'),
(15, 18, 2, null),
(14, 12, 4, 'dobra pesna ama drugiot album bese podobar');


INSERT INTO SAVED_PLAYLISTS (listener_id, playlist_id) VALUES
(2,1), (1,3), (2,2), (1,2), (17,3), (16,3);

INSERT INTO PLAYLIST_SONGS (song_id, playlist_id) VALUES
(1,1), (16,1), (17,1), (11,1), (3,1), (8,1), (6,1),
(11,2), (13,2), (16,2);

INSERT INTO  ARTIST_CONTRIBUTIONS (musical_entity_id, artist_id, role) VALUES
(1,8,'MAIN_VOCAL'), (2,8,'MAIN_VOCAL'),(3,8,'MAIN_VOCAL'),
(4,8,'MAIN_VOCAL'),(5,8,'MAIN_VOCAL'),(6,9,'MAIN_VOCAL'),
(7,9,'MAIN_VOCAL'),(8,9,'MAIN_VOCAL'),(9,9,'MAIN_VOCAL'),
(10,9,'MAIN_VOCAL'),(11,7,'MAIN_VOCAL'),(12,7,'MAIN_VOCAL'),
(13,7,'MAIN_VOCAL'),(14,7,'MAIN_VOCAL'),(15,7,'MAIN_VOCAL'),
(16,12,'MAIN_VOCAL'),(17,12,'MAIN_VOCAL'),(18,10,'MAIN_VOCAL'),
(19,10,'MAIN_VOCAL'),(20,10,'MAIN_VOCAL'),(21,10,'MAIN_VOCAL');