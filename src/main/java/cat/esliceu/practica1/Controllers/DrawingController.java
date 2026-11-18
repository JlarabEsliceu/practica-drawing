package cat.esliceu.practica1.Controllers;

import cat.esliceu.practica1.model.Draw;
import cat.esliceu.practica1.service.DrawingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DrawingController {
    @Autowired
    DrawingService drawingService;

    @GetMapping("/dibuix")
    public String editor(HttpSession session){
        String username = (String) session.getAttribute("username");
        if (username == null){
            return "redirect:/login";
        }
        return "dibuix";
    }

    @PostMapping("/dibuix/save")
    public String repDibuix(@RequestParam(defaultValue = "0") int id, @RequestParam String name, @RequestParam String objects, @RequestParam int objectCount, HttpSession session){
        String username = (String) session.getAttribute("username");
        if(username == null){
            return "redirect:/login";
        }
        drawingService.saveDraw(id,name,objects,objectCount, username);
        return "redirect:/historial";

    }
    @GetMapping("/historial")
    public String historialMeus(HttpSession session, Model model){
        String username = (String) session.getAttribute("username");
        if (username == null){
            return "redirect:/login";
        }
        model.addAttribute("draws", drawingService.getDrawsByUser(username));
        model.addAttribute("filtre", "meus");
        return "historial";
    }

    @GetMapping("/historial/tots")
    public String historialTots(HttpSession session, Model model){
        String username = (String) session.getAttribute("username");
        if (username == null){
            return "redirect:/login";
        }
        model.addAttribute("draws", drawingService.getAllDraws());
        model.addAttribute("filtre", "tots");
        return "historial";
    }

    @PostMapping("/dibuix/{id}/delete")
    public String borrarDibuix(@PathVariable int id, HttpSession session){
        String username = (String) session.getAttribute("username");
        if (username == null){
            return "redirect:/login";
        }
        drawingService.deleteDraw(id,username);
        return "redirect:/historial";
    }

    @GetMapping("/dibuix/{id}")
    public String editarVeureDibuix(@PathVariable int id, HttpSession session, Model model){
        String username = (String) session.getAttribute("username");
        boolean propietari = false;
        if (username == null){
            return "redirect:/login";
        }
        Draw draw = drawingService.getDraw(id);
        if (draw == null) return "redirect:/historial";
        if (draw.getOwner().equals(username)) propietari = true;
        model.addAttribute("draw", draw);
        model.addAttribute("propietari", propietari);
        return "dibuix";

    }
}
