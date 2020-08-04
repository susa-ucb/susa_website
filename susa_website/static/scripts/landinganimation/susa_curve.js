let landing = document.getElementById("container-landing");

function animateCode({timing, draw, duration}) {
    let start = performance.now();
    let blender = document.getElementById("blender");
    let code = document.getElementById("curve-code");
    let codeContainer = document.getElementById("container-code");
    let curves = document.getElementById("curves");
    let landing = document.getElementById("landing");
    code.classList.add('animating');

    requestAnimationFrame(function animate(time) {

        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;


        let progress = timing(timeFraction)

        draw(progress);

        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        }

        if (timeFraction > .9) {
            if (!codeContainer.classList.contains('fade')) {
                codeContainer.classList.add('fade');
                blender.classList.add('fade');
            }
        }

        if (timeFraction == 1) {
            codeContainer.parentNode.removeChild(codeContainer);
            blender.parentNode.removeChild(blender);
            curves.classList.add('animating');
            landing.classList.add('animating');
        }

  });
}

function animateText(textArea) {
    let el = document.getElementById(textArea);
    let text = el.innerHTML;
    let to = text.length,
        from = 0;

    function linear(timeFraction) {
        return timeFraction
    }

    animateCode({
        duration: 5000,
        timing: linear,
        draw: function(progress) {
            let result = (to - from) * progress + from;
            let next = text.substr(0, Math.ceil(result));
            document.getElementById(textArea).innerHTML = next;
            el.scrollTop = el.scrollHeight;
        }
    });
}
