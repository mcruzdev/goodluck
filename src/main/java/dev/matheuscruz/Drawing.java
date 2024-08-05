package dev.matheuscruz;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.Set;

import io.vertx.core.impl.ConcurrentHashSet;

public class Drawing {

    enum Status {
        CREATED,
        FINISHED
    }

    String id;
    String qrCode;
    Status status;
    Set<Participant> participants = new ConcurrentHashSet<>();

    public Drawing(String id, String qrCode) {
        this.id = id;
        this.qrCode = qrCode;
        this.status = Status.CREATED;
    }

    public String getId() {
        return id;
    }

    public String getQrCode() {
        return qrCode;
    }

    public List<String> start(Integer quantityOfWinners) {

        if (quantityOfWinners >= this.participants.size()) {
            return this.participants.stream().map(p -> p.getEmail()).toList();
        }

        List<Participant> participants = new ArrayList<>(this.participants);

        Collections.shuffle(participants, new Random());

        List<Participant> winners = participants.subList(0, quantityOfWinners);

        this.status = Status.FINISHED;

        return winners.stream().map(p -> p.getEmail()).toList();
    }
}
