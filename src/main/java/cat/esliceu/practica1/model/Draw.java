package cat.esliceu.practica1.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Draw {
    private long id;
    private String name;
    private String owner;
    private String objects;
    private int objectCount;
    private LocalDateTime createdAt;
    private LocalDateTime   updatedAt;

    public Draw(long id, String name, String owner, String objects, int objectCount, LocalDateTime createdAt, LocalDateTime updatedAt){
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.objects = objects;
        this.objectCount = objectCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
