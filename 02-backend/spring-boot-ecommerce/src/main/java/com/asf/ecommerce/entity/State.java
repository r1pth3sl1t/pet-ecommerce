package com.asf.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "state", schema = "full_stack_ecommerce")
@Data
public class State {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;
}
