package cat.esliceu.practica1.repo;

import cat.esliceu.practica1.model.Draw;
import org.springframework.stereotype.Repository;

@Repository
public class DrawRepoImpl implements DrawRepo{
    @Override
    public Draw findByDrawId(String id){
        Draw draw = new Draw();
        return draw;
    }

}
