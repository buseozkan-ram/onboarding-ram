package com.ramtracking.demo;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/places")
public class PlaceController {
    private final PlaceRepository placeRepository;

    @GetMapping
    public List<Place> getPlaces(Authentication authentication) {
        String userId = authentication.getName();
        return placeRepository.findByUserId(userId);
    }

    @PostMapping
    public Place addPlace(@RequestBody Place place, Authentication authentication) {
        place.setUserId(authentication.getName());
        return placeRepository.save(place);
    }

    @DeleteMapping("/{id}")
    public void deletePlace(@PathVariable Long id, Authentication authentication) {
        Place place = placeRepository.findById(id).orElseThrow();
        if (!place.getUserId().equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        placeRepository.delete(place);
    }
}
