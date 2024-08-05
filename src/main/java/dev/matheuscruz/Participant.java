package dev.matheuscruz;

import java.util.Objects;

public class Participant {
    String email;
    String name;

    Participant(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Participant participant = (Participant) obj;
        return Objects.equals(participant.email, this.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.email);
    }

    @Override
    public String toString() {
        return "email: %s, name: %s".formatted(this.email, this.name);
    }
}
