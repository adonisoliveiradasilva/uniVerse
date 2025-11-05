package br.com.my_universe.api.infrastructure.config;

import br.com.my_universe.api.application.services.JwtService;
import br.com.my_universe.api.application.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// 1. NOVOS IMPORTS
import org.springframework.util.AntPathMatcher;
import java.util.Arrays;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    // 2. ADICIONAR UM MATCHER DE ROTAS
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    // 3. **** MÉTODO NOVO ADICIONADO ****
    /**
     * Diz ao Spring para NÃO EXECUTAR este filtro em rotas públicas.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Lista de rotas públicas que este filtro deve IGNORAR
        final String[] PUBLIC_PATHS = {
            "/api/auth/**",
            "/api/students"
        };

        // Se a rota da requisição bater com uma das rotas públicas,
        // este filtro NÃO DEVE RODAR (retorna true).
        return Arrays.stream(PUBLIC_PATHS)
                     .anyMatch(path -> pathMatcher.match(path, request.getServletPath()));
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Graças ao 'shouldNotFilter', este código agora SÓ RODA para
        // rotas protegidas (ex: GET /api/subjects, PUT /api/students/{email}, etc.)

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Se for uma rota protegida sem token, o Spring Security
            // (mais adiante na cadeia) vai bloquear com 401/403.
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            // Se o token estiver expirado ou for inválido
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"status\": 401, \"error\": \"Token JWT inválido ou expirado.\"}");
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}