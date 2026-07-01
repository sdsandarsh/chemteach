/**
 * InteractivePT - Modern Periodic Table visualization
 * window.InteractivePT.init(container, config)
 * config: { mode: 'explore' }
 */
window.InteractivePT = (() => {
  const ELEMENTS = [
    { z: 1, sym: 'H', group: 1, period: 1, block: 's' },
    { z: 2, sym: 'He', group: 18, period: 1, block: 's' },
    { z: 3, sym: 'Li', group: 1, period: 2, block: 's' },
    { z: 4, sym: 'Be', group: 2, period: 2, block: 's' },
    { z: 5, sym: 'B', group: 13, period: 2, block: 'p' },
    { z: 6, sym: 'C', group: 14, period: 2, block: 'p' },
    { z: 7, sym: 'N', group: 15, period: 2, block: 'p' },
    { z: 8, sym: 'O', group: 16, period: 2, block: 'p' },
    { z: 9, sym: 'F', group: 17, period: 2, block: 'p' },
    { z: 10, sym: 'Ne', group: 18, period: 2, block: 'p' },
    { z: 11, sym: 'Na', group: 1, period: 3, block: 's' },
    { z: 12, sym: 'Mg', group: 2, period: 3, block: 's' },
    { z: 13, sym: 'Al', group: 13, period: 3, block: 'p' },
    { z: 14, sym: 'Si', group: 14, period: 3, block: 'p' },
    { z: 15, sym: 'P', group: 15, period: 3, block: 'p' },
    { z: 16, sym: 'S', group: 16, period: 3, block: 'p' },
    { z: 17, sym: 'Cl', group: 17, period: 3, block: 'p' },
    { z: 18, sym: 'Ar', group: 18, period: 3, block: 'p' },
    { z: 19, sym: 'K', group: 1, period: 4, block: 's' },
    { z: 20, sym: 'Ca', group: 2, period: 4, block: 's' },
    { z: 21, sym: 'Sc', group: 3, period: 4, block: 'd' },
    { z: 22, sym: 'Ti', group: 4, period: 4, block: 'd' },
    { z: 23, sym: 'V', group: 5, period: 4, block: 'd' },
    { z: 24, sym: 'Cr', group: 6, period: 4, block: 'd' },
    { z: 25, sym: 'Mn', group: 7, period: 4, block: 'd' },
    { z: 26, sym: 'Fe', group: 8, period: 4, block: 'd' },
    { z: 27, sym: 'Co', group: 9, period: 4, block: 'd' },
    { z: 28, sym: 'Ni', group: 10, period: 4, block: 'd' },
    { z: 29, sym: 'Cu', group: 11, period: 4, block: 'd' },
    { z: 30, sym: 'Zn', group: 12, period: 4, block: 'd' },
    { z: 31, sym: 'Ga', group: 13, period: 4, block: 'p' },
    { z: 32, sym: 'Ge', group: 14, period: 4, block: 'p' },
    { z: 33, sym: 'As', group: 15, period: 4, block: 'p' },
    { z: 34, sym: 'Se', group: 16, period: 4, block: 'p' },
    { z: 35, sym: 'Br', group: 17, period: 4, block: 'p' },
    { z: 36, sym: 'Kr', group: 18, period: 4, block: 'p' },
    { z: 37, sym: 'Rb', group: 1, period: 5, block: 's' },
    { z: 38, sym: 'Sr', group: 2, period: 5, block: 's' },
    { z: 39, sym: 'Y', group: 3, period: 5, block: 'd' },
    { z: 40, sym: 'Zr', group: 4, period: 5, block: 'd' },
    { z: 41, sym: 'Nb', group: 5, period: 5, block: 'd' },
    { z: 42, sym: 'Mo', group: 6, period: 5, block: 'd' },
    { z: 43, sym: 'Tc', group: 7, period: 5, block: 'd' },
    { z: 44, sym: 'Ru', group: 8, period: 5, block: 'd' },
    { z: 45, rh: 'Rh', group: 9, period: 5, block: 'd', sym: 'Rh' },
    { z: 46, sym: 'Pd', group: 10, period: 5, block: 'd' },
    { z: 47, sym: 'Ag', group: 11, period: 5, block: 'd' },
    { z: 48, sym: 'Cd', group: 12, period: 5, block: 'd' },
    { z: 49, sym: 'In', group: 13, period: 5, block: 'p' },
    { z: 50, sym: 'Sn', group: 14, period: 5, block: 'p' },
    { z: 51, sym: 'Sb', group: 15, period: 5, block: 'p' },
    { z: 52, sym: 'Te', group: 16, period: 5, block: 'p' },
    { z: 53, sym: 'I', group: 17, period: 5, block: 'p' },
    { z: 54, sym: 'Xe', group: 18, period: 5, block: 'p' },
    { z: 55, sym: 'Cs', group: 1, period: 6, block: 's' },
    { z: 56, sym: 'Ba', group: 2, period: 6, block: 's' },
    // Lanthanides (f-block, drawn below)
    { z: 57, sym: 'La', group: 3, period: 6, block: 'd' },
    { z: 58, sym: 'Ce', group: null, period: 8, block: 'f' },
    { z: 59, sym: 'Pr', group: null, period: 8, block: 'f' },
    { z: 60, sym: 'Nd', group: null, period: 8, block: 'f' },
    { z: 61, sym: 'Pm', group: null, period: 8, block: 'f' },
    { z: 62, sym: 'Sm', group: null, period: 8, block: 'f' },
    { z: 63, sym: 'Eu', group: null, period: 8, block: 'f' },
    { z: 64, sym: 'Gd', group: null, period: 8, block: 'f' },
    { z: 65, sym: 'Tb', group: null, period: 8, block: 'f' },
    { z: 66, sym: 'Dy', group: null, period: 8, block: 'f' },
    { z: 67, sym: 'Ho', group: null, period: 8, block: 'f' },
    { z: 68, sym: 'Er', group: null, period: 8, block: 'f' },
    { z: 69, sym: 'Tm', group: null, period: 8, block: 'f' },
    { z: 70, sym: 'Yb', group: null, period: 8, block: 'f' },
    { z: 71, sym: 'Lu', group: null, period: 8, block: 'f' },
    
    { z: 72, sym: 'Hf', group: 4, period: 6, block: 'd' },
    { z: 73, sym: 'Ta', group: 5, period: 6, block: 'd' },
    { z: 74, sym: 'W', group: 6, period: 6, block: 'd' },
    { z: 75, sym: 'Re', group: 7, period: 6, block: 'd' },
    { z: 76, sym: 'Os', group: 8, period: 6, block: 'd' },
    { z: 77, sym: 'Ir', group: 9, period: 6, block: 'd' },
    { z: 78, sym: 'Pt', group: 10, period: 6, block: 'd' },
    { z: 79, sym: 'Au', group: 11, period: 6, block: 'd' },
    { z: 80, sym: 'Hg', group: 12, period: 6, block: 'd' },
    { z: 81, sym: 'Tl', group: 13, period: 6, block: 'p' },
    { z: 82, sym: 'Pb', group: 14, period: 6, block: 'p' },
    { z: 83, sym: 'Bi', group: 15, period: 6, block: 'p' },
    { z: 84, sym: 'Po', group: 16, period: 6, block: 'p' },
    { z: 85, sym: 'At', group: 17, period: 6, block: 'p' },
    { z: 86, sym: 'Rn', group: 18, period: 6, block: 'p' },
    
    { z: 87, sym: 'Fr', group: 1, period: 7, block: 's' },
    { z: 88, sym: 'Ra', group: 2, period: 7, block: 's' },
    { z: 89, sym: 'Ac', group: 3, period: 7, block: 'd' },
    // Actinides
    { z: 90, sym: 'Th', group: null, period: 9, block: 'f' },
    { z: 91, sym: 'Pa', group: null, period: 9, block: 'f' },
    { z: 92, sym: 'U', group: null, period: 9, block: 'f' },
    { z: 93, sym: 'Np', group: null, period: 9, block: 'f' },
    { z: 94, sym: 'Pu', group: null, period: 9, block: 'f' },
    { z: 95, sym: 'Am', group: null, period: 9, block: 'f' },
    { z: 96, sym: 'Cm', group: null, period: 9, block: 'f' },
    { z: 97, sym: 'Bk', group: null, period: 9, block: 'f' },
    { z: 98, sym: 'Cf', group: null, period: 9, block: 'f' },
    { z: 99, sym: 'Es', group: null, period: 9, block: 'f' },
    { z: 100, sym: 'Fm', group: null, period: 9, block: 'f' },
    { z: 101, sym: 'Md', group: null, period: 9, block: 'f' },
    { z: 102, sym: 'No', group: null, period: 9, block: 'f' },
    { z: 103, sym: 'Lr', group: null, period: 9, block: 'f' },

    { z: 104, sym: 'Rf', group: 4, period: 7, block: 'd' },
    { z: 105, sym: 'Db', group: 5, period: 7, block: 'd' },
    { z: 106, sym: 'Sg', group: 6, period: 7, block: 'd' },
    { z: 107, sym: 'Bh', group: 7, period: 7, block: 'd' },
    { z: 108, sym: 'Hs', group: 8, period: 7, block: 'd' },
    { z: 109, sym: 'Mt', group: 9, period: 7, block: 'd' },
    { z: 110, sym: 'Ds', group: 10, period: 7, block: 'd' },
    { z: 111, sym: 'Rg', group: 11, period: 7, block: 'd' },
    { z: 112, sym: 'Cn', group: 12, period: 7, block: 'd' },
    { z: 113, sym: 'Nh', group: 13, period: 7, block: 'p' },
    { z: 114, sym: 'Fl', group: 14, period: 7, block: 'p' },
    { z: 115, sym: 'Mc', group: 15, period: 7, block: 'p' },
    { z: 116, sym: 'Lv', group: 16, period: 7, block: 'p' },
    { z: 117, sym: 'Ts', group: 17, period: 7, block: 'p' },
    { z: 118, sym: 'Og', group: 18, period: 7, block: 'p' }
  ];

  const BLOCK_COLORS = {
    's': '#00B4CC', 
    'p': '#FFD740',
    'd': 'var(--color-accent)', // #00E5FF
    'f': '#1A6B8A'
  };

  function build(container, config) {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'interactive-pt-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '20px';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '10px';
    controls.style.justifyContent = 'center';

    const infoPanel = document.createElement('div');
    infoPanel.style.height = '40px';
    infoPanel.style.color = 'var(--color-text)';
    infoPanel.style.fontWeight = 'bold';
    infoPanel.style.fontSize = '1.1rem';
    infoPanel.textContent = 'Hover over elements or block buttons to explore the table.';

    const btnS = document.createElement('button'); btnS.className = 'btn btn-outline'; btnS.textContent = 's-block';
    const btnP = document.createElement('button'); btnP.className = 'btn btn-outline'; btnP.textContent = 'p-block';
    const btnD = document.createElement('button'); btnD.className = 'btn btn-outline'; btnD.textContent = 'd-block';
    const btnF = document.createElement('button'); btnF.className = 'btn btn-outline'; btnF.textContent = 'f-block';
    
    controls.append(btnS, btnP, btnD, btnF);

    const ptGrid = document.createElement('div');
    ptGrid.style.display = 'grid';
    ptGrid.style.gridTemplateColumns = 'repeat(18, 30px)';
    ptGrid.style.gridTemplateRows = 'repeat(10, 30px)';
    ptGrid.style.gap = '4px';
    ptGrid.style.position = 'relative';

    const cells = [];

    ELEMENTS.forEach(el => {
      const cell = document.createElement('div');
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.fontSize = 'clamp(12px, 1.2vw, 26px)';
      cell.style.fontWeight = 'bold';
      cell.style.borderRadius = '4px';
      cell.style.cursor = 'pointer';
      cell.style.transition = 'all 0.2s';
      cell.style.border = '1px solid var(--color-border)';
      cell.style.background = 'var(--color-card)';
      cell.style.color = 'var(--color-text)';
      cell.style.userSelect = 'none';

      if (el.group) {
        cell.style.gridColumn = el.group;
        cell.style.gridRow = el.period;
      } else {
        // f block offset
        const offset = (el.z >= 58 && el.z <= 71) ? el.z - 57 : el.z - 89;
        cell.style.gridColumn = 3 + offset;
        cell.style.gridRow = el.period;
      }

      cell.textContent = el.sym;
      
      cell.dataset.block = el.block;
      cell.dataset.z = el.z;
      cell.dataset.group = el.group || '';
      cell.dataset.period = el.period;

      cell.onmouseover = () => {
        infoPanel.textContent = `Z=${el.z} | ${el.sym} | ${el.block}-block | Period ${el.period > 7 ? el.period-2 : el.period}` + (el.group ? ` | Group ${el.group}` : '');
        highlightBlock(el.block);
        cell.style.transform = 'scale(1.1)';
        cell.style.zIndex = '10';
        cell.style.background = BLOCK_COLORS[el.block];
        cell.style.color = '#000';
        cell.style.opacity = '1';
        cell.style.borderColor = BLOCK_COLORS[el.block];
      };
      
      cell.onmouseout = () => {
        infoPanel.textContent = 'Hover over elements or block buttons to explore the table.';
        resetHighlights();
        cell.style.transform = 'scale(1)';
        cell.style.zIndex = '1';
      };

      cells.push(cell);
      ptGrid.appendChild(cell);
    });

    const highlightBlock = (block) => {
      cells.forEach(c => {
        if (c.dataset.block === block) {
          c.style.background = BLOCK_COLORS[block];
          c.style.color = '#000';
          c.style.borderColor = BLOCK_COLORS[block];
          c.style.opacity = '1';
        } else {
          c.style.background = 'var(--color-card)';
          c.style.color = 'var(--color-text-muted)';
          c.style.borderColor = 'var(--color-border)';
          c.style.opacity = '0.3';
        }
      });
    };

    const resetHighlights = () => {
      cells.forEach(c => {
        c.style.background = 'var(--color-card)';
        c.style.color = 'var(--color-text)';
        c.style.borderColor = 'var(--color-border)';
        c.style.opacity = '1';
      });
    };

    btnS.onmouseover = () => highlightBlock('s');
    btnP.onmouseover = () => highlightBlock('p');
    btnD.onmouseover = () => highlightBlock('d');
    btnF.onmouseover = () => highlightBlock('f');
    
    btnS.onmouseout = resetHighlights;
    btnP.onmouseout = resetHighlights;
    btnD.onmouseout = resetHighlights;
    btnF.onmouseout = resetHighlights;

    wrapper.appendChild(infoPanel);
    wrapper.appendChild(ptGrid);
    wrapper.appendChild(controls);
    container.appendChild(wrapper);
  }

  return { init: build };
})();
