<?php
// Routes

$app->get('/test', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("custom url '/' route");
    $data = array('name' => 'Rob', 'age' => 40);
	return $response->withJson($data, 201);
	
    // Render index view
    //return $this->renderer->render($response, 'index.phtml', $args);
});

$app->post('/test', function ($request, $response, $args) {
    // Sample log message
    echo('è una post');
	
    // Render index view
    //return $this->renderer->render($response, 'index.phtml', $args);
});

$app->post('/libro/{id}/{pippo}', function ($request, $response, $args) {
    // Sample log message
    echo('è una post'.$args['id']);
    echo('\n '.$args['pippo']);
    $parsedBody = $request->getParsedBody();
    var_dump($parsedBody['titolo']);
    $this->logger->info($parsedBody);
    // Render index view
    //return $this->renderer->render($response, 'index.phtml', $args);
});

//AGGIUNGI NUOVO AUTORE
$app->post('/autore',function ($request, $response, $args) {
		$parsedBody = $request->getParsedBody();
		// $this->logger->info($parsedBody));

		if (trim(empty($parsedBody['nome_autore']))){
			$data = array('errorMsg' => 'Manca il nome autore', 'code' => 0001);
			return $response->withJson($data, 500);
		} else {
			$query ="INSERT INTO autore(nome_autore)
					VALUES ('" . $parsedBody['nome_autore'] . "')";
			$db = getConnection();
			$stmt = $db->prepare($query);  
			$stmt->execute();
			$db = null;
			
			$sql ="SELECT * FROM autore WHERE id_autore = (SELECT MAX(id_autore) FROM autore)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);  
				$stmt->execute();
				

				while ($autori = $stmt->fetch(PDO::FETCH_ASSOC)){
					$data[] = $autori;
				};

				$this->logger->info(var_export($data, true));
				return $response->withJson($data[0], 201); 
			} catch(PDOException $e) {
				$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
				return $response->withJson($data, 500);
			};
				$db = null;


		}
		
	});

//AGGIUNGI NUOVA CATEGORIA
$app->post('/categoria',function ($request, $response, $args) {
		$parsedBody = $request->getParsedBody();
		$this->logger->info(var_export($parsedBody, true));
		
		if (trim(empty($parsedBody['descrizione']))){
			$data = array('errorMsg' => 'Manca la categoria', 'code' => 0001);
			return $response->withJson($data, 500);
		} else {
			$query ="INSERT INTO categoria(descrizione)
				VALUES ('" . $parsedBody['descrizione'] . "')";
			$db = getConnection();
			$stmt = $db->prepare($query);  
			$stmt->execute();
			$db = null;
			
			$sql ="SELECT * FROM categoria WHERE id_categoria = (SELECT MAX(id_categoria) FROM categoria)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);  
				$stmt->execute();
				

				while ($categorie = $stmt->fetch(PDO::FETCH_ASSOC)){
					$data[] = $categorie;
				};

				$this->logger->info(var_export($data, true));
				return $response->withJson($data[0], 201); 
			} catch(PDOException $e) {
				$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
				return $response->withJson($data, 500);
			};
				$db = null;


		}
	});

//AGGIUNGI NUOVO UTENTE
$app->post('/utente',function ($request, $response, $args) {
	$parsedBody = $request->getParsedBody();
	$this->logger->info(var_export($parsedBody, true));

		
		if (trim(empty($parsedBody['nome_utente']))){
			$data = array('errorMsg' => 'Manca il nome utente', 'code' => 0001);
			return $response->withJson($data, 500);
		} else {
			$query ="INSERT INTO utente(nome_utente)
				VALUES ('" . $parsedBody['nome_utente'] . "')";
			$db = getConnection();
			$stmt = $db->prepare($query);  
			$stmt->execute();
			$db = null;
			
			$sql ="SELECT * FROM utente WHERE id_utente = (SELECT MAX(id_utente) FROM utente)";
			try {
				$db = getConnection();
				$stmt = $db->prepare($sql);  
				$stmt->execute();
				

				while ($utenti = $stmt->fetch(PDO::FETCH_ASSOC)){
					$data[] = $utenti;
				};

				$this->logger->info(var_export($data, true));
				$db = null;
				return $response->withJson($data[0], 201); 
			} catch(PDOException $e) {
				$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
				return $response->withJson($data, 500);
			};


		}
	});

//AGGIUNGI LIBRO

$app->post('/libro',function ($request, $response, $args) {
	$parsedBody = $request->getParsedBody();
	$this->logger->info(var_export($parsedBody, true));
	$categorie = $parsedBody['categorie'];
	$autori = $parsedBody['autori'];

	$titolo = $parsedBody['titolo']; 
	$isbn = $parsedBody['isbn']; 
	$editore = $parsedBody['editore'];
	$numero_pagine = $parsedBody['numero_pagine'];
	$collocazione = $parsedBody['collocazione'];
	$argomenti = $parsedBody['argomenti'];


	try {
		$db = getConnection();
		$db->beginTransaction();

		$values = array(':titolo'=> $titolo,':isbn' => $isbn,
			':editore' => $editore, ':numero_pagine' => $numero_pagine,
			':collocazione' => $collocazione, ':argomenti' => $argomenti);

		$query = "INSERT INTO libro (titolo, isbn, editore, numero_pagine, collocazione, argomenti) VALUES (:titolo, :isbn, :editore, :numero_pagine, :collocazione, :argomenti);";

		$stmt = $db->prepare($query);
		$stmt->execute($values);


		$queryAutori = "INSERT INTO autore_libro(id_autore,id_libro)
		VALUES ((SELECT id_autore FROM autore WHERE nome_autore = :nome_autore), (SELECT MAX(id_libro) FROM libro));";

		foreach ($autori as $nomeAutore) {
			$valuesAut = array(':nome_autore' => $nomeAutore);    
			$stmt = $db->prepare($queryAutori);
			$stmt->execute($valuesAut);
		};


		$queryCat ="INSERT INTO categoria_libro(id_categoria,id_libro) VALUES ( (SELECT id_categoria FROM categoria WHERE descrizione = :categoria ), (SELECT MAX(id_libro)FROM libro) );";

		foreach ($categorie as $nomeCategoria) {
			$valuesCat = array(':categoria' => $nomeCategoria);
			$stmt = $db->prepare($queryCat);
			$stmt->execute($valuesCat);
		};
$this->logger->info(var_export($queryCat, true));

		$db->commit();

		return $response->withJson(null, 201); 
	} catch(PDOException $e) {
		$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
		if  ($db != null){
			$db->rollback();
		}
		return $response->withJson($data, 500);
		
	};

		$db = null;

});

//AGGIUNGI LETTURA 

$app->post('/reading',function ($request, $response, $args) {
	$parsedBody = $request->getParsedBody();
	$this->logger->info(var_export($parsedBody, true));
	
	$id_libro = $parsedBody['id_libro'];
	$id_utente = $parsedBody['id_utente'];
	$num_pag_lette = $parsedBody['num_pag_lette'];
	$note = $parsedBody['note'];
	$data_inizio_lettura = $parsedBody['data_inizio_lettura'];
	$data_fine_lettura = $parsedBody['data_fine_lettura'];
	$dataIn = new DateTime($data_inizio_lettura);
	$dataInFormat = $dataIn->format('Y-m-d');
	$dataFin = new DateTime($data_fine_lettura);
	$dataFinFormat = $dataFin->format('Y-m-d');


	try {
		$db = getConnection();
		$db->beginTransaction();

		$values = array(':id_libro'=> $id_libro,':id_utente' => $id_utente,
			':num_pag_lette' => $num_pag_lette, ':note' => $note,
			':dataInFormat' => $dataInFormat, ':dataFinFormat' => $dataFinFormat);

		$query = "INSERT INTO libro_letto(id_libro,id_utente,
				num_pag_lette,data_inizio_lettura,data_fine_lettura,note)
			VALUES (:id_libro,
				:id_utente,
				:num_pag_lette,
				:dataInFormat,
				:dataFinFormat,
				:note);";

		$stmt = $db->prepare($query);
		$stmt->execute($values);

		$db->commit();

		return $response->withJson(null, 201); 
	} catch(PDOException $e) {
		$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
		if  ($db != null){
			$db->rollback();
		}
		return $response->withJson($data, 500);
		
	};

		$db = null;

});


//UPDATE LIBRO

$app->post('/modLibro',function ($request, $response, $args) {
$parsedBody = $request->getParsedBody();
$this->logger->info(var_export($parsedBody, true));

$id_utente = $parsedBody['libro']['id_utente'];
$id_libro = $parsedBody['libro']['id_libro'];
$id_libro_letto = $parsedBody['libro']['id_libro_letto'];
$titolo = $parsedBody['libro']['titolo']; 
$isbn = $parsedBody['libro']['isbn']; 
$editore = $parsedBody['libro']['editore'];
$numero_pagine = $parsedBody['libro']['numero_pagine'];
$collocazione = $parsedBody['libro']['collocazione'];
$argomenti = $parsedBody['libro']['argomenti'];
$num_pag_lette = $parsedBody['libro']['num_pag_lette'];
$data_inizio_lettura = $parsedBody['libro']['data_inizio_lettura'];
$data_fine_lettura = $parsedBody['libro']['data_fine_lettura'];
$note = $parsedBody['libro']['note'];
$dataIn = new DateTime($data_inizio_lettura);
$dataInFormat = $dataIn->format('Y-m-d');
$dataFin = new DateTime($data_fine_lettura);
$dataFinFormat = $dataFin->format('Y-m-d');

$values = array(':titolo'=> $titolo, ':id_libro'=> $id_libro,
	':isbn' => $isbn,
	':editore' => $editore, ':numero_pagine' => $numero_pagine,
	':collocazione' => $collocazione, ':argomenti' => $argomenti);

$query = "UPDATE libro 
		SET titolo=:titolo,
		isbn=:isbn,
		editore=:editore,
		numero_pagine=:numero_pagine,
		collocazione=:collocazione,
		argomenti=:argomenti 
		WHERE id_libro=:id_libro;";

$db = getConnection();
$db->beginTransaction();

$stmt = $db->prepare($query);
$stmt->execute($values);

$values2 = array(':num_pag_lette' => $num_pag_lette, ':data_inizio_lettura' => $dataInFormat, ':data_fine_lettura' => $dataFinFormat, ':note' => $note, ':id_libro_letto' => $id_libro_letto);

 $query = "UPDATE libro_letto 
		  SET num_pag_lette=:num_pag_lette
		  ,data_inizio_lettura=:data_inizio_lettura
		  ,data_fine_lettura=:data_fine_lettura
		  ,note=:note 
		   WHERE libro_letto.id_libro_letto=:id_libro_letto";

$stmt = $db->prepare($query);
$stmt->execute($values2);

$db->commit();

$db = null;

//		return $response->withJson($data, 201); 
//	} catch(PDOException $e) {
//		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
//	};
});

// DELETE LIBRO

//$app->delete('/libro/:id')
$app->post('/cancLibro',function ($request, $response, $args) {
$parsedBody = $request->getParsedBody();
$this->logger->info(var_export($parsedBody, true));
$id_libro = $parsedBody['idLibro'];

$query = 'START TRANSACTION;
				DELETE FROM libro WHERE id_libro ="' . $id_libro .'";
				DELETE FROM autore_libro WHERE id_libro ="' . $id_libro .'";
				DELETE FROM categoria_libro WHERE id_libro ="' . $id_libro .'";
				DELETE FROM libro_letto WHERE id_libro ="' . $id_libro .'";
				COMMIT;';


try {
		$db = getConnection();
		$stmt = $db->prepare($query);  
		$stmt->execute();
		return $response->withJson(null, 202);
} catch(PDOException $e) {
		$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
		return $response->withJson($data, 500);
	};
	$db = null; 

});


$app->get('/autori', function($request, $response, $args) {
	$this->logger->info("ho chiamato lettura autori");
    $sql = 'SELECT id_autore,nome_autore FROM autore';
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		while ($autori = $stmt->fetch(PDO::FETCH_ASSOC)){
			$data[] = $autori;
		};
		$db = null;
		return $response->withJson($data, 201); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	};
});


$app->post('/cancAutore', function($request, $response, $args) {
	$this->logger->info("chiamato cancellazione autore");
	$parsedBody = $request->getParsedBody();
	$id_autore = $parsedBody['id_autore'];

	$query = "SELECT COUNT(*) FROM libro JOIN autore_libro ON libro.id_libro=
				autore_libro.id_libro JOIN autore ON
				autore_libro.id_autore=autore.id_autore 
				WHERE autore.id_autore = " . $id_autore;
	try {
		$db = getConnection();
		$stmt = $db->prepare($query);  
		$stmt->execute();
		$res_num = $stmt->fetchColumn();
		$this->logger->debug(var_export($res_num, true));
			if($res_num == 0){
				$query = 'DELETE FROM autore WHERE id_autore ="' . $id_autore .'"';
				$stmt = $db->prepare($query);
				$stmt->execute();

				return $response->withJson(null, 202);
				//TODO verifica rowCount
			} else {
				$data = array('errorMsg' => 'Libri associati all autore', 'code' => 0003);
				return $response->withJson($data, 500);
			}
	} catch(PDOException $e) {
		$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
		return $response->withJson($data, 500);
	};
	$db = null; 

});


$app->get('/utenti', function($request, $response, $args) {
	$this->logger->info("ho chiamato lettura utenti");
    $sql = 'SELECT id_utente,nome_utente FROM utente';
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		while ($utenti = $stmt->fetch(PDO::FETCH_ASSOC)){
			$data[] = $utenti;
		};
		return $response->withJson($data, 201); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	};
		$db = null;
});


$app->post('/cancUtente', function($request, $response, $args) {
	$this->logger->info("chiamato cancellazione utente");
	$parsedBody = $request->getParsedBody();
	$id_utente = $parsedBody['id_utente'];

	$query = 'SELECT * FROM libro JOIN libro_letto ON libro.id_libro = libro_letto.id_libro
                JOIN utente ON utente.id_utente = libro_letto.id_utente
				WHERE utente.id_utente = "' . $id_utente . '"';

	try {
		$db = getConnection();
		$stmt = $db->prepare($query);  
		$stmt->execute();
		$res_num = $stmt->fetchColumn();
		$this->logger->debug(var_export($res_num, true));
			if($res_num == 0){
				$query = 'DELETE FROM utente WHERE id_utente ="' . $id_utente .'"';
				$stmt = $db->prepare($query);
				$stmt->execute();

				return $response->withJson(null, 202);
				//TODO verifica rowCount
			} else {
				$data = array('errorMsg' => 'Libri associati all utente', 'code' => 0003);
				return $response->withJson($data, 500);
			}
	} catch(PDOException $e) {
		$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
		return $response->withJson($data, 500);
	};
	$db = null; 

});



$app->get('/categorie', function($request, $response, $args) {
	$this->logger->info("ho chiamato lettura categorie");
    $sql = 'SELECT id_categoria,descrizione FROM categoria';
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		while ($categorie = $stmt->fetch(PDO::FETCH_ASSOC)){
			$data[] = $categorie;
		};
		$db = null;
		return $response->withJson($data, 201); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	};
});


$app->post('/cancCategoria', function($request, $response, $args) {
	$this->logger->info("chiamato cancellazione categoria");
	$parsedBody = $request->getParsedBody();
	$id_categoria = $parsedBody['id_categoria'];

	$query = 'SELECT * FROM libro JOIN categoria_libro ON libro.id_libro =
				categoria_libro.id_libro JOIN categoria ON
				categoria_libro.id_categoria = categoria.id_categoria
				WHERE categoria.id_categoria = "' . $id_categoria . '"';
	   try {
		$db = getConnection();
		$stmt = $db->prepare($query);  
		$stmt->execute();
		$res_num = $stmt->fetchColumn();
		$this->logger->debug(var_export($res_num, true));
			if($res_num == 0) {
				$query = 'DELETE FROM categoria WHERE id_categoria ="' . $id_categoria .'"';
				$stmt = $db->prepare($query);
				$stmt->execute();

				return $response->withJson(null, 202);
				//TODO verifica rowCount
			} else {
				$data = array('errorMsg' => 'Libri associati alla categoria', 'code' => 0003);
				return $response->withJson($data, 500);
			}
		} catch(PDOException $e) {
			$data = array('errorMsg' => $e->getMessage(), 'code' => 0002);
			return $response->withJson($data, 500);
		};
		$db = null; 

});


$app->get('/libri', function ($request, $response, $args) {
    $this->logger->info("ho chiamato lettura libri dell utente");
    $sql = 'SELECT *, GROUP_CONCAT(distinct categoria.descrizione) as categorie, 
				GROUP_CONCAT(distinct autore.nome_autore) as autori 
	 			FROM libro JOIN autore_libro ON libro.id_libro=
				autore_libro.id_libro JOIN autore ON
				autore_libro.id_autore=autore.id_autore 
				JOIN categoria_libro ON libro.id_libro =
				categoria_libro.id_libro JOIN categoria ON
				categoria_libro.id_categoria = categoria.id_categoria
		        JOIN libro_letto ON libro.id_libro = libro_letto.id_libro
                JOIN utente ON utente.id_utente = libro_letto.id_utente
				GROUP BY libro_letto.id_libro, libro_letto.id_utente
';
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		while ($libri = $stmt->fetch(PDO::FETCH_ASSOC)){
			$data[] = $libri;
		};
		$db = null;
		return $response->withJson($data, 201); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
};
});

$app->get('/books', function ($request, $response, $args) {
    $this->logger->info("ho chiamato lettura books dell utente");
    $sql = 'SELECT * FROM libro';
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		while ($libri = $stmt->fetch(PDO::FETCH_ASSOC)){
			$data[] = $libri;
		};
		$db = null;
		return $response->withJson($data, 201); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
};
});

$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});



 /* Connects to the 'formEditor' database */
 	
function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="";
	$dbname="biblio";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$dbh->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
	$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	return $dbh;
}

