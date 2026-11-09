package cat.esliceu.practica1.repo;

import cat.esliceu.practica1.model.Draw;

import java.util.List;

public interface DrawRepo {
    Draw findByDrawId(int id);
    void addDraw(Draw draw);
    void deleteDraw(int id);
    List<Draw> findByUser(String user);
    List<Draw> findAll();

}
