let stompClient = null;
// изменение внешнего вида страницы после подключения/отключения
// от веб-сокета
function setConnected(connected) {
    // активация/деактивация кнопок "подключить/отключить"
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    // если подключились - отображаем поле ввода для общения,
    if (connected) {
        $("#conversation").show();
    }
    else {
        // иначе - скрываем его
        $("#conversation").hide();
    }
    // в любом случае очищаем переписку
    $("#greetings").html("");
}
// подписка на рассылку -
// клиент становится клиентом веб-сокета
function connect() {
    // создаем объект для подключения,
    // указывая конечную точку подписки
    const socket = new SockJS('/gs-guide-websocket')
    // инициализируем объект,
    // при помощи которого можно отправлять сообщения на точку назначения
    stompClient = Stomp.over(socket)
    // запуск соединения (подписки)
    stompClient.connect({}, function (frame) {
        // функция обратного вызова,
        // которая сработает после успешного соединения
        setConnected(true);
        console.log('Connected: ' + frame)
        // подписка на рассылку сообщений с точки назначения /topic/greetings
        stompClient.subscribe('/topic/greetings', function (greeting) {
            // когда придет сообщение - передаем его в функцию вывода на представление
            showGreeting(JSON.parse(greeting.body).content)
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

// отправка сообщения на адрес hello,
// где произойдет передача сообщения в точку назначения /topic/greetings
// и запуск рассылки этого сообщения всем участникам подписки
function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val()}));
}
// отображение каждого нового сообщения, поступившего с сервера
//  рассылке
function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});

