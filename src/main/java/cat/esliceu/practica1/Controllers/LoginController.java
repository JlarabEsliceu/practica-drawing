package cat.esliceu.practica1.Controllers;

import cat.esliceu.practica1.service.LoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController{
    @Autowired
    LoginService loginService;

    @GetMapping("/login")
    public String login(){return "login";}

    @PostMapping("/login")
    public String loginPost(@RequestParam String username, @RequestParam String password,
                            Model model, HttpSession session){
        if (username.length() < 2){
            model.addAttribute("messeg", "User name ha de tenir dues lletres minim");
            return "login";
        }
        if (loginService.checkLogin(username, password)) {
            session.setAttribute("username", username);
            return "redirect:/private";
        }
        model.addAttribute("message", "Usuari/pass incorrectes");
        return "login";
    }

    @GetMapping("/private")
    public String parPrivada(HttpSession session){
        String username = (String) session.getAttribute("username");
        if (username == null){
            return "redirect:/login";
        }
        return "private";
    }
}
