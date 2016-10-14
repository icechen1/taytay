var socket = io.connect();

window.addEventListener("load", function() {
	var log = document.getElementById("log");
	var maxChats = 100;

  var previous = [];
  var current = 0;

	var getRandUsername = function(){
		var list_A = ["Anonymous","Quirky","Extravagant","Funny","Ignorant","Fail","Frustrated","Smart","Active","Undefined"]
		var list_B = ["Steve","Ballmer","Zombie","Bill","Gates","Interns","Jacklope",
		"Elephant","Giraffe","Bravo","Lollipop","KitKat","Jellybean","Dolphin","Whale","Hasselhoff","Beetle","Lion","NaN","Pointer"]

		return list_A[Math.floor(Math.random() * list_A.length)] + " " + list_B[Math.floor(Math.random() * list_B.length)];
	};
	//get a spiffy username
	document.getElementById("username").value = getRandUsername();

	var pressCommand = function(cmd) {
		socket.emit('command', {
			"message": cmd,
			"username": document.getElementById("username").value
		});
	}

	var sendMessage = function() {
		if (document.getElementById("message").value.replace(/(\n|\w)$/, "")=="") {
			return;
		}
		pressCommand(document.getElementById("message").value.replace(/\n$/, ""));

    previous.push(document.getElementById("message").value.replace(/\n$/, ""));
    while (previous.length>maxChats) {
      previous.shift();
    }
    current = previous.length;
		document.getElementById("message").value="";
	}

	var mapping = {
		37: { class: '.left', action: 'left'},
		38: { class: '.up', action: 'forward'},
		39: { class: '.right', action: 'right'},
		40: { class: '.down', action: 'backward'},
	};

	$(document.documentElement).keydown(function(event){
			var key = mapping[event.keyCode];
			if (key) {
				$(key.class).addClass('pressed');
				pressCommand(key.action);
			}
	});

	$(document.documentElement).keyup(function(event){
			var key = mapping[event.keyCode];
			if (key) {
				$(key.class).removeClass('pressed');
			}
	});

	var setupKeys = function (key, effect) {
		$(key).mousedown(function(){
			$(this).addClass('pressed');
			pressCommand(effect);
		});
		$(key).mouseup(function(){
			$(this).removeClass('pressed');
		});
	}
	setupKeys('.left', 'left');
	setupKeys('.right', 'right');
	setupKeys('.up', 'forward');
	setupKeys('.down', 'backward');
	setupKeys('.stop', 'stop');

	document.getElementById("send").addEventListener("click", sendMessage);
	document.getElementById("message").addEventListener("keyup", function(evt) {
		if (evt.keyCode == 13) {
			sendMessage();
      return false;
		} else if (evt.keyCode == 38 && current-1>=0 && (current<previous.length || document.getElementById("message").value=="")) {
      current--;
      document.getElementById("message").value = previous[current];
    } else if (evt.keyCode == 40 && current+1<=previous.length) {
      current++;
      if (current==previous.length) {
        document.getElementById("message").value = "";
      } else {
        document.getElementById("message").value = previous[current];
      }
    }
	});
	socket.on('command', function(command) {
    console.log(command);
		var m = document.createElement("div");
		m.className="message";

		var t = document.createElement("div");
		t.className = "text";
		t.innerHTML = command.message;


		var u = document.createElement("div");
		u.className="user";
		u.innerHTML = command.username;

		m.appendChild(u);
		m.appendChild(t);

		while (log.childNodes.length>maxChats) {
			log.removeChild(log.firstChild);
		}

		log.appendChild(m);
		log.scrollTop = log.scrollHeight;
	});

  socket.on('selected', function(command) {
    console.log(command);
		var m = document.createElement("div");
		m.className="message";

		var t = document.createElement("div");
		t.className = "selected";
		t.innerHTML = "Moved " + command.message + ", thanks to " + command.username;

		m.appendChild(t);

		while (log.childNodes.length>maxChats) {
			log.removeChild(log.firstChild);
		}

		log.appendChild(m);
		log.scrollTop = log.scrollHeight;
	});
});
