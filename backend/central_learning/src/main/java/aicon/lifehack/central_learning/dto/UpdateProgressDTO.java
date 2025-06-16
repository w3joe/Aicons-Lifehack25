package aicon.lifehack.central_learning.dto;

import aicon.lifehack.central_learning.model.Difficulty;
import lombok.Data;

@Data
public class UpdateProgressDTO {
    private Difficulty newDifficulty;
}
