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

    public String register(String name,String username, String password1, String password2){
        if (name == null || name.isBlank()) return "Falta name";
        if (username == null || username.isBlank()) return "Falta el username";
        username = username.trim();
        name = name.trim();

        if (userRepo.findByUsername(username) != null){
            return "Aquest Usuari ya existeix";
        }
        if(password1.length() < 5){
            return "El password ha de tenir minim 5 caracters";
        }
        if (!password1.equals(password2)){
            return "Els passwords no coincideixen";
        }
        User user = new User(name,username,password1);
        userRepo.addUser(user);
        return null;
    }


}
