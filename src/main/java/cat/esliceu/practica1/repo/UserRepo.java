package cat.esliceu.practica1.repo;

import cat.esliceu.practica1.model.User;

public interface UserRepo {
    User findByUsername(String username);
    void addUser(User user);
}
