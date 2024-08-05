package dev.matheuscruz;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateParticipantRequest(@Email @NotBlank String email, @NotBlank String name) {

}
