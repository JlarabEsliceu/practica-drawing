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

    public String saveUser(String username, String password1, String password2){
        if (!registerCheck(username,password1,password2).isEmpty()){return registerCheck(username,password1,password2);}
        User user = new User(username,password1);
        userRepo.addUser(user);
        return "S'ha creat l'Usuari correctament";
    }

    public String registerCheck(String username, String password1, String password2){
        if(userRepo.findByUsername(username) == null){
            return "Aquest Usuari ya existeix";
        }
        if (!password1.equals(password2)){
            return "Els passwords no son iguals";
        }
        if (checkPasswordLong(password1)){return "El password ha de tenir minim 5 caracters";}
        return "";
    }

    public boolean checkPasswordLong(String password){
        if(password.length() < 4){
            return false;
        }
        return true;
    }

}
