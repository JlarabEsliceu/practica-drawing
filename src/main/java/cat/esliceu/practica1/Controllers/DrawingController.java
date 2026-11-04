package cat.esliceu.practica1.Controllers;

import cat.esliceu.practica1.service.DrawingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DrawingController {
    @Autowired
    DrawingService drawingService;

    @GetMapping("/dibuix")
    public String dibuix(){return "dibuix";}
}
