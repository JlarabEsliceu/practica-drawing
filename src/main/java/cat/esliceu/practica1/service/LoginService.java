package cat.esliceu.practica1.service;

import cat.esliceu.practica1.model.User;
import cat.esliceu.practica1.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    UserRepo userRepo;

    public boolean checkLogin(String username, String password){
        User u = userRepo.findByUsername(username);
        if(u != null && u.getPassword().equals(password)){
            return true;
        }
        return false;
    }

}
