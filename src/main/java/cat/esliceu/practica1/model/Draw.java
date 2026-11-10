package cat.esliceu.practica1.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Draw {
    private int id;
    private String name;
    private String owner;
    private String objects;
    private int objectCount;
    private LocalDateTime createdAt;
    private LocalDateTime   updatedAt;

    public Draw(String name, String owner, String objects, int objectCount){
        this.name = name;
        this.owner = owner;
        this.objects = objects;
        this.objectCount = objectCount;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getObjects() {
        return objects;
    }

    public void setObjects(String objects) {
        this.objects = objects;
    }

    public int getObjectCount() {
        return objectCount;
    }

    public void setObjectCount(int objectCount) {
        this.objectCount = objectCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
