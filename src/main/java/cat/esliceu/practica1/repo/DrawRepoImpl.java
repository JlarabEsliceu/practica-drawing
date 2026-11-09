package cat.esliceu.practica1.repo;

import cat.esliceu.practica1.model.Draw;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DrawRepoImpl implements DrawRepo{
    Map<Integer,Draw> draws  = new HashMap<>();
    int contador = 0;


    @Override
    public Draw findByDrawId(int id){
        Draw draw = draws.get(id);
        if (draw == null) return null;
        return draw;
    }

    @Override
    public void addDraw(Draw draw){
        if (draw.getId() == 0){
            contador++;
            draw.setId(contador);
        }
        draws.put(draw.getId(),draw);
    }
    @Override
    public void deleteDraw(int id){
        draws.remove(id);
    }

    @Override
    public List<Draw> findByUser(String user) {
        List<Draw> drawsPerUser = new ArrayList<>();
        for (Draw draw : draws.values()){
            if(draw.getOwner().equals(user)){
                drawsPerUser.add(draw);
            }
        }
        return drawsPerUser;
    }

    @Override
    public List<Draw> findAll(){
        List<Draw> allDraws = new ArrayList<>();
        allDraws.addAll(draws.values());
        return allDraws;
    }


}
