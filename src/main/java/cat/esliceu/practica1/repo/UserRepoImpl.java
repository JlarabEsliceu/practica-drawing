package cat.esliceu.practica1.repo;


import cat.esliceu.practica1.model.User;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class UserRepoImpl implements UserRepo {
    List<User> list = new ArrayList<>(List.of(new User("admin","admin","admin")));



    @Override
    public User findByUsername(String username) {
        for (User user : list){
            if (user.getUsername().equals(username)){
                return user;
            }
        }
        return null;
    }

    @Override
    public void addUser(User user){
        list.add(user);
    }
}
