package com.ramtracking.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class PlaceRepositoryTest {

    @Autowired
    private PlaceRepository placeRepository;

    @Test
    public void testFindByUserId() {
        Place place1 = new Place();
        place1.setName("Place 1");
        place1.setLatitude(10.0);
        place1.setLongitude(20.0);
        place1.setUserId("user1");
        placeRepository.save(place1);

        Place place2 = new Place();
        place2.setName("Place 2");
        place2.setLatitude(30.0);
        place2.setLongitude(40.0);
        place2.setUserId("user2");
        placeRepository.save(place2);

        List<Place> user1Places = placeRepository.findByUserId("user1");
        assertThat(user1Places).hasSize(1);
        assertThat(user1Places.get(0).getName()).isEqualTo("Place 1");

        List<Place> user2Places = placeRepository.findByUserId("user2");
        assertThat(user2Places).hasSize(1);
        assertThat(user2Places.get(0).getName()).isEqualTo("Place 2");
    }
}
