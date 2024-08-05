package dev.matheuscruz;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.jboss.logging.Logger;

import io.smallrye.mutiny.Uni;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;
import jakarta.ws.rs.core.Response.Status;
import net.glxn.qrgen.core.image.ImageType;
import net.glxn.qrgen.javase.QRCode;

@Path("/api/drawings")
public class DrawingResource {

    private static final Logger LOGGER = Logger.getLogger(DrawingResource.class);

    private static final Map<String, Drawing> DRAWINGS = new ConcurrentHashMap<String, Drawing>();

    final Validator validator;

    public DrawingResource(Validator validator) {
        this.validator = validator;
    }

    @POST
    public Response create() {
        LOGGER.info("Creating new drawing!");

        String id = UUID.randomUUID().toString();

        QRCode qrCode = QRCode.from("/drawings/" + id + "/participants");

        Drawing drawing = new Drawing(id, qrCode.to(ImageType.PNG).file().getAbsolutePath());

        DRAWINGS.put(drawing.getId(), drawing);

        return Response.status(Status.CREATED).entity(drawing).build();
    }

    @GET
    @Produces("image/png")
    @Path("/{id}/qrcode")
    public Uni<Response> get(@PathParam(value = "id") String id) {
        LOGGER.info("Getting QRCode by id: " + id);
        LOGGER.info("Drawings: " + DRAWINGS.keySet().toString());
        Drawing drawing = DRAWINGS.get(id);

        if (drawing == null) {
            return Uni.createFrom().item(Response.status(Status.NOT_FOUND).build());
        }

        File file = new File(drawing.getQrCode());

        ResponseBuilder response = Response.ok((Object) file);

        response.header("Content-Disposition", "attachment;filename=" + file.getName());

        return Uni.createFrom().item(response.build());
    }

    @POST
    @Path("/{id}/participants")
    public Response participant(@PathParam(value = "id") String id, CreateParticipantRequest request) {

        Set<ConstraintViolation<CreateParticipantRequest>> violations = validator.validate(request);

        if (!violations.isEmpty()) {
            return Response.status(Status.BAD_REQUEST).entity(violations).build();
        }

        Drawing drawing = DRAWINGS.get(id);
        if (drawing == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        LOGGER.info("Adding new participant to drawing with id " + id);

        Participant participant = new Participant(request.email(), request.name());

        if (!drawing.participants.contains(participant)) {
            drawing.participants.add(participant);
        }

        return Response.status(Status.CREATED).entity(participant).build();
    }

    @GET
    @Path("/{id}/participants")
    public Response participants(@PathParam("id") String id) {
        Drawing drawing = DRAWINGS.get(id);
        if (drawing == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(drawing.participants).build();
    }

    @POST
    @Path("/{id}/start")
    public Response start(@PathParam("id") String id, StartDrawingRequest request) {
        Drawing drawing = DRAWINGS.get(id);
        if (drawing == null) {
            return Response.status(Status.NOT_FOUND).build();
        }
        
        List<String> emails = drawing.start(request.quantityOfWinners());

        return Response.ok(emails).build();
    }
}
