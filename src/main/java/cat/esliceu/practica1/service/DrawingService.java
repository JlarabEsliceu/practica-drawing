package cat.esliceu.practica1.service;

import cat.esliceu.practica1.model.Draw;
import cat.esliceu.practica1.repo.DrawRepo;
import org.springframework.beans.factory.annotation.Autowired;
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
        Draw draw;

        if (name == null || name.isBlank()){
            name = "Dibuix_" + UUID.randomUUID().toString().substring(0,6);
        }
        if(id == 0) {
            draw = new Draw(name, username, objects, count);
            drawRepo.addDraw(draw);
            return true;
        }
        else{
            draw = drawRepo.findByDrawId(id);
            if(draw != null && draw.getOwner().equals(username)) {
                updateDraw(draw, name, objects, count);
                return true;
            }
        }
        return false;
    }

    public void deleteDraw(int id, String username){
        Draw draw = drawRepo.findByDrawId(id);
        if (draw != null && draw.getOwner().equals(username)){
            drawRepo.deleteDraw(id);
        }
    }

    private void updateDraw(Draw draw, String name, String objects, int count){
        draw.setName(name);
        draw.setUpdatedAt(LocalDateTime.now());
        draw.setObjectCount(count);
        draw.setObjects(objects);
    }
}
