package hello;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {

    // адрес, на который подписавшиеся клиенты
    // могут присылать сообщения
    @MessageMapping("/hello")
    // куда отправлять сообщения, пришедшие от любого
    // клиента рассылки - придумываем название "темы"
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        // эти данные присылаются принудительно каждому клиенту-подписчику
        // (когда один из участников прислал сообщение, оно рассылается всем)
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

}
