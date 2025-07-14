package com.ramtracking.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PlaceController.class)
public class PlaceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlaceRepository placeRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Place place;

    @BeforeEach
    public void setup() {
        place = new Place();
        place.setId(1L);
        place.setName("Test Place");
        place.setLatitude(10.0);
        place.setLongitude(20.0);
        place.setUserId("user1");
    }

    @Test
    @WithMockUser(username = "user1")
    public void testGetPlaces() throws Exception {
        given(placeRepository.findByUserId(anyString())).willReturn(Arrays.asList(place));

        mockMvc.perform(get("/places"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user1")
    public void testAddPlace() throws Exception {
        given(placeRepository.save(any(Place.class))).willReturn(place);

        mockMvc.perform(post("/places")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(place)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user1")
    public void testDeletePlaceAuthorized() throws Exception {
        given(placeRepository.findById(1L)).willReturn(java.util.Optional.of(place));
        doNothing().when(placeRepository).delete(place);

        mockMvc.perform(delete("/places/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user2")
    public void testDeletePlaceForbidden() throws Exception {
        given(placeRepository.findById(1L)).willReturn(java.util.Optional.of(place));

        mockMvc.perform(delete("/places/1"))
                .andExpect(status().isForbidden());
    }
}
