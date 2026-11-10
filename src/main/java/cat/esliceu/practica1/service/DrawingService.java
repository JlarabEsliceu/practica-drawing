package cat.esliceu.practica1.service;

import cat.esliceu.practica1.model.Draw;
import cat.esliceu.practica1.repo.DrawRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.autoconfigure.JacksonProperties;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class DrawingService {

    @Autowired
    DrawRepo drawRepo;

    public Draw getDraw(int id){
        return drawRepo.findByDrawId(id);
    }

    public List<Draw> getDrawsByUser(String username){
        return drawRepo.findByUser(username);
    }

    public List<Draw> getAllDraws(){
        return drawRepo.findAll();
    }

    public boolean saveDraw(int id, String name, String objects, int count, String username){
        boolean creatModificat = false;
        Draw draw;

        if (name == null || name.isEmpty()){
            name = "Dibuix_" + UUID.randomUUID().toString().substring(0,6);
        }
        if(id == 0) {
            draw = new Draw(name, username, objects, count);
            draw.setCreatedAt(LocalDateTime.now());
            draw.setUpdatedAt(LocalDateTime.now());
            creatModificat = true;
        }
        else{
            draw = drawRepo.findByDrawId(id);
            if(draw != null && draw.getOwner().equals(username)){
                draw.setName(name);
                draw.setUpdatedAt(LocalDateTime.now());
                draw.setObjectCount(count);
                draw.setObjects(objects);
                creatModificat = true;
            }
        }
        if (creatModificat) drawRepo.addDraw(draw);
        return creatModificat;

    }

    public void deleteDraw(int id, String username){
        if (drawRepo.findByDrawId(id) != null && drawRepo.findByDrawId(id).getOwner().equals(username)){
            drawRepo.deleteDraw(id);
        }
    }
}
