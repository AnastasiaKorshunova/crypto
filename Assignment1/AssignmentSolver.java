package assignment1;

import assignment1.crypto.AesCbcDecryptor;
import assignment1.crypto.EcSigner;
import assignment1.crypto.KeyFinder;
import assignment1.model.AssignmentInput;
import assignment1.model.AssignmentResult;
import assignment1.model.AssignmentResult.KeyCandidate;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.HexFormat;
import java.util.List;

/**
 * Runs the four steps in order. Knows nothing about where the input comes from
 * or how the result is shown - it takes data in and returns data out.
 */
public class AssignmentSolver {

    private static final HexFormat HEX = HexFormat.of();

    private final KeyFinder keyFinder;
    private final AesCbcDecryptor decryptor;
    private final String curveName;

    public AssignmentSolver(KeyFinder keyFinder, AesCbcDecryptor decryptor, String curveName) {
        this.keyFinder = keyFinder;
        this.decryptor = decryptor;
        this.curveName = curveName;
    }

    public AssignmentResult solve(AssignmentInput input) throws GeneralSecurityException {
        // Step 1
        List<KeyCandidate> candidates = keyFinder.check(input.candidateKeys(), input.keyHash());
        byte[] key = keyFinder.findCorrectKey(candidates);

        // Step 2
        byte[] plaintext = decryptor.decrypt(key, HEX.parseHex(input.iv()), HEX.parseHex(input.ciphertext()));

        // Step 3 - a new key pair on every run
        EcSigner signer = new EcSigner(curveName);

        // Step 4
        byte[] signature = signer.sign(plaintext);
        boolean valid = EcSigner.verify(signer.publicKey(), plaintext, signature);

        return new AssignmentResult(
            candidates,
            HEX.formatHex(key),
            new String(plaintext, StandardCharsets.UTF_8),
            signer.curveName(),
            signer.publicKeyPem(),
            HEX.formatHex(signer.publicKey().getEncoded()),
            HEX.formatHex(signature),
            valid);
    }
}
