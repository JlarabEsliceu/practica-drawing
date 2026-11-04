package cat.esliceu.practica1.service;

import cat.esliceu.practica1.repo.DrawRepoImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DrawingService {

    @Autowired
    DrawRepoImpl drawRepo;
}
