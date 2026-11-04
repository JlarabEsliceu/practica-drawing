package cat.esliceu.practica1.repo;


import cat.esliceu.practica1.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepoImpl implements UserRepo {
    List<User> list = List.of(
            new User("toni", "1234"),
            new User("jesus", "1234")
            );

    @Override
    public User findByUsername(String username) {
        for (User user : list){
            if (user.getUsername().equals(username)){
                return user;
            }
        }
        return null;
    }
}
