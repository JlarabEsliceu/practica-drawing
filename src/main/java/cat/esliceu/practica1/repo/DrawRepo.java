package cat.esliceu.practica1.repo;

import cat.esliceu.practica1.model.Draw;

public interface DrawRepo {
    Draw findByDrawId(String id);

}
