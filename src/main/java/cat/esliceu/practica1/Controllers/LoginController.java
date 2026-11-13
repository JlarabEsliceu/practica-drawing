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
            model.addAttribute("message", "User name ha de tenir dues lletres minim");
            return "login";
        }
        if (loginService.checkLogin(username, password)) {
            session.setAttribute("username", username);
            return "redirect:/dibuix";
        }
        model.addAttribute("message", "Usuari/pass incorrectes");
        return "login";
    }



    @GetMapping("/register")
    public String register(){return "register";}

    @PostMapping("/register")
    public String registerPost(@RequestParam String name, @RequestParam String username, @RequestParam String password1, @RequestParam String password2, Model model){
        String error = loginService.register(name,username,password1,password2);
        if(error != null){
            model.addAttribute("message", error);
            return "register";
        }
        return "redirect:/login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session){
        session.invalidate();
        return "redirect:/login";
    }
}
